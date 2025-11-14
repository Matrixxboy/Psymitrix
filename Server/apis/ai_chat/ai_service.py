import os
import shutil
from typing import Tuple, List, Dict
from datetime import datetime
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    BitsAndBytesConfig
)
import chromadb
from chromadb.config import Settings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv
import nltk
from langchain.prompts import PromptTemplate
from langchain.schema import StrOutputParser
from langchain_core.runnables import Runnable, RunnablePassthrough
from nltk.tokenize import sent_tokenize

load_dotenv()

# Download NLTK data if not present
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt_tab')

# ===========================
# CONFIGURATION
# ===========================

HF_API_TOKEN = os.getenv("HUGGINGFACEHUB_API_TOKEN")
os.environ["HUGGINGFACEHUB_API_TOKEN"] = HF_API_TOKEN

CHROMA_PATH = "./chroma_db"
MODEL_NAME = "Matrixxboy/PsyMitrix_psychiatrist"
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"

# ===========================
# INITIALIZATION
# ===========================

def initialize_local_llm():
    """Load PsyMitrix model and tokenizer in 4-bit."""
    try:
        print(f"[INFO] Loading model and tokenizer: {MODEL_NAME}")

        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=True)

        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16
        )

        model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            quantization_config=bnb_config,
            device_map="auto",
            trust_remote_code=True,
            low_cpu_mem_usage=True
        )

        print("[INFO] Model and tokenizer loaded in 4-bit mode.")
        return model, tokenizer

    except Exception as e:
        print(f"[ERROR] LLM Load Failed: {e}")
        import traceback
        traceback.print_exc()
        return None, None

def initialize_chroma_client():
    """Initialize ChromaDB client."""
    try:
        settings = Settings(anonymized_telemetry=False)
        return chromadb.PersistentClient(path=CHROMA_PATH, settings=settings)
    except Exception as e:
        print(f"[ERROR] Failed to init Chroma: {e}")
        return None

model, tokenizer = initialize_local_llm()
chroma_client = initialize_chroma_client()

# ===========================
# LANGCHAIN SETUP
# ===========================

class HuggingFaceModelRunnable(Runnable):
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer

    def invoke(self, input_value, config=None):
        input_text = input_value.to_string() if hasattr(input_value, 'to_string') else str(input_value)
        
        inputs = self.tokenizer(input_text, return_tensors="pt", truncation=True, max_length=1024).to(self.model.device)

        with torch.no_grad():
            outputs = self.model.generate(
                **inputs,
                max_new_tokens=150,
                do_sample=True,
                temperature=0.7,
                top_k=50,
                top_p=0.95,
                pad_token_id=self.tokenizer.eos_token_id
            )

        decoded_output = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Extract only the generated text after the prompt
        start_of_generation_idx = decoded_output.rfind(input_text)
        if start_of_generation_idx != -1:
            raw_generated_text = decoded_output[start_of_generation_idx + len(input_text):].strip()
            
            # Clean up response
            sentences = sent_tokenize(raw_generated_text)
            sentences = [s.strip() for s in sentences if s.strip()]
            
            if len(sentences) > 3:
                return " ".join(sentences[:3])
            elif sentences:
                return " ".join(sentences)
        
        return "I'm finding it a bit difficult to articulate my thoughts right now. Could you share a little more about what's on your mind?"

if model and tokenizer:
    llm = HuggingFaceModelRunnable(model, tokenizer)

    prompt_template = PromptTemplate.from_template(
    f"""[INST]
You are Shvayam, a compassionate AI therapist. You respond ONLY mental and emotional wellbeing needs.
If the user asks anything unrelated to emotional or mental health, gently decline and redirect.

STRICT RESPONSE RULES (follow EXACTLY):
1. Give ONLY ONE final response.
2. Your reply MUST be exactly 2–3 full, complete sentences of warm, natural human language.
3. You MUST NOT output multiple versions, fragments, options, or attempts. Only one single continuous reply.
4. You MUST NOT output partial sentences, repeated starters, or try to "suggest" multiple possible responses.
5. DO NOT output any code, markdown, symbols, or formatting (including: ```, #, lists, imports, JSON, indentation).
6. DO NOT output labels such as Neutral, Positive, (RESPONSE), or anything similar.
7. DO NOT repeat anything you or the user said earlier. Every reply must be fresh and unique.
8. DO NOT reference these instructions, your identity, context, memory, system roles, or how you generate answers.
9. DO NOT include disclaimers or mention tools, technology, logs, programming, or creators.
10. Your output must contain **zero extra lines** before or after the final reply.
11. DO NOT output any phone numbers, URLs, websites, or contact information, unless explicitly asked by the user.

FINAL AND MOST IMPORTANT RULE:
Your output must contain **only one single natural-language reply of 2–3 complete sentences**, with no prefix, no postfix, and nothing else.
[/INST]
Context: {{context}}\nResponse:""")
    output_parser = StrOutputParser()
    chain = (prompt_template | llm | output_parser)
    print("[INFO] LangChain chain initialized successfully.")
else:
    chain = None
    print("[ERROR] LangChain chain could not be initialized because model or tokenizer failed to load.")

# ===========================
# KNOWLEDGE BASE & VECTOR STORE
# ===========================

MENTAL_HEALTH_KNOWLEDGE = [
    "Cognitive Behavioral Therapy helps reframe negative thinking.",
    "Mindfulness reduces anxiety by focusing on the present.",
    "Depression often involves persistent sadness and low energy.",
]

vector_store = None
user_vector_stores = {}

def initialize_vector_store():
    global vector_store
    if not chroma_client: return None
    try:
        embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
        vector_store = Chroma(client=chroma_client, collection_name="psy_health", embedding_function=embeddings)
        if vector_store._collection.count() == 0:
            vector_store.add_texts(MENTAL_HEALTH_KNOWLEDGE)
            print("[INFO] Added base knowledge to ChromaDB.")
        return vector_store
    except Exception as e:
        print(f"[ERROR] Vector store init failed: {e}")
        return None

def get_user_vector_store(user_id: str):
    if user_id in user_vector_stores: return user_vector_stores[user_id]
    try:
        embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
        name = f"user_{user_id.replace('-', '_')}_mem"
        store = Chroma(client=chroma_client, collection_name=name, embedding_function=embeddings)
        user_vector_stores[user_id] = store
        return store
    except Exception as e:
        print(f"[ERROR] User vector store error: {e}")
        return None

def add_message_to_user_history(uid, msg, resp):
    store = get_user_vector_store(uid)
    if store:
        text = f"[{datetime.utcnow().isoformat()}] USER: {msg}\nAI: {resp}"
        try:
            store.add_texts([text])
        except Exception as e:
            print(f"[WARN] Could not add message: {e}")

# ===========================
# ANALYSIS
# ===========================

def analyze_message(message: str, ctx: Dict) -> Dict:
    crisis = ["suicide", "kill myself", "self harm", "end my life"]
    severe = ["hopeless", "panic", "worthless"]
    moderate = ["sad", "lonely", "worried", "tired"]
    msg = message.lower()
    lvl, action = "low", "continue_support"
    if any(k in msg for k in crisis): lvl, action = "critical", "provide_crisis_resources"
    elif any(k in msg for k in severe): lvl, action = "severe", "suggest_professional_help"
    elif any(k in msg for k in moderate): lvl, action = "moderate", "offer_emotional_support"
    return {"severity_level": lvl, "recommended_action": action, "timestamp": datetime.utcnow().isoformat()}

# ===========================
# RESPONSE GENERATION
# ===========================

async def get_ai_response(user_id: str, user_message: str, username: str, user_context: Dict, conversation_history: List[Dict]) -> Tuple[str, Dict]:
    """Generate empathetic, context-aware mental health responses using LangChain."""

    if not chain:
        return "I'm sorry, but the AI service is currently unavailable. Please try again later.", {"error": "LangChain chain not initialized"}

    try:
        # Prepare context string
        assessments_summary = "No recent assessments."
        if user_context.get("recent_assessments"):
            assessments_summary = "\n".join(
                [f"- {a['type']}: {a['score']} ({a['severity']})" for a in user_context["recent_assessments"]]
            )
        
        history = "\n".join(
            [f"{m['role'].upper()}: {m['content']}" for m in conversation_history[-3:]]
        )

        context_str = f"User: {username}\nMood: {user_context.get('recent_mood', 'N/A')}\nAssessments: {assessments_summary}\nRecent History: {history}\nUser Message: {user_message}"

        # Invoke the LangChain chain
        reply = await chain.ainvoke({
            "context": context_str,
        })

        if not reply or not reply.strip():
            reply = "It sounds like a lot is on your mind. I'm here to listen whenever you're ready to share."

        add_message_to_user_history(user_id, user_message, reply)
        analysis = analyze_message(user_message, user_context)
        
        return reply, analysis

    except Exception as e:
        print(f"[ERROR] LangChain response generation failed: {e}")
        return (
            "That sounds difficult. I’m here for you — let’s take it one step at a time.",
            {"error": str(e)},
        )


# ===========================
# STARTUP
# ===========================

initialize_vector_store()
print("[READY ✅] PsyMitrix AI initialized successfully.")
