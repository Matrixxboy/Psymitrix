import os
import shutil
from typing import Tuple, List, Dict
from datetime import datetime
import torch
from transformers import (
    AutoTokenizer,
    AutoModelForCausalLM,
    pipeline,
    BitsAndBytesConfig
)
import chromadb
from chromadb.config import Settings
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from dotenv import load_dotenv
load_dotenv()
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
    """Load PsyMitrix model in 4-bit only (best for 4GB VRAM GPUs)."""
    try:
        print(f"[INFO] Loading your model: {MODEL_NAME}")

        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=True)

        # Force 4-bit ALWAYS (GTX 1650 cannot handle FP16 models reliably)
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_use_double_quant=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16  # safer than float16
        )

        model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            quantization_config=bnb_config,
            device_map="auto",
            trust_remote_code=True,
            low_cpu_mem_usage=True
        )

        print("[INFO] Model loaded in safe 4-bit mode.")

        # SAFE PIPELINE — remove FP16 to prevent RAM leaks
        llm_pipeline = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            temperature=0.6,
            top_p=0.9,
            repetition_penalty=1.1,
            max_new_tokens=120,   # ⬅ LOWERED for RAM safety
            pad_token_id=tokenizer.eos_token_id,
            eos_token_id=tokenizer.eos_token_id
        )

        print("[INFO] PsyMitrix LLM ready in optimized low-memory mode.")
        return llm_pipeline

    except Exception as e:
        print(f"[ERROR] LLM Load Failed: {e}")
        import traceback
        traceback.print_exc()
        return None


def initialize_chroma_client():
    """Initialize ChromaDB client."""
    try:
        settings = Settings(anonymized_telemetry=False)
        return chromadb.PersistentClient(path=CHROMA_PATH, settings=settings)
    except Exception as e:
        print(f"[ERROR] Failed to init Chroma: {e}")
        return None


local_llm_pipeline = initialize_local_llm()
chroma_client = initialize_chroma_client()

# ===========================
# KNOWLEDGE BASE
# ===========================

MENTAL_HEALTH_KNOWLEDGE = [
    "Cognitive Behavioral Therapy helps people reframe negative thinking patterns.",
    "Mindfulness reduces anxiety by focusing awareness on the present moment.",
    "Depression often involves persistent sadness, loss of motivation, and low energy.",
    "Regular exercise, nutrition, and social connection improve mental well-being.",
    "If you are in crisis or thinking about self-harm, please reach out for help immediately.",
]

vector_store = None
user_vector_stores = {}

# ===========================
# VECTOR STORE MANAGEMENT
# ===========================

def initialize_vector_store():
    global vector_store
    if not chroma_client:
        return None
    try:
        embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
        vector_store = Chroma(
            client=chroma_client,
            collection_name="psy_health",
            embedding_function=embeddings
        )
        if vector_store._collection.count() == 0:
            vector_store.add_texts(MENTAL_HEALTH_KNOWLEDGE)
            print("[INFO] Added base knowledge to ChromaDB.")
        return vector_store
    except Exception as e:
        print(f"[ERROR] Vector store init failed: {e}")
        return None


def get_user_vector_store(user_id: str):
    if user_id in user_vector_stores:
        return user_vector_stores[user_id]
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

import re
import json

async def get_ai_response(user_id: str, user_message: str, user_context: Dict, conversation_history: List[Dict]) -> Tuple[str, Dict]:
    """Generate empathetic, context-aware mental health responses."""

    if not local_llm_pipeline:
        return "I'm sorry, but the AI service is currently unavailable. Please try again later.", {"error": "LLM pipeline not initialized"}

    try:
        assessments_summary = "No recent assessments."
        if user_context.get("recent_assessments"):
            assessments_summary = "\n".join(
                [f"- {a['type']}: {a['score']} ({a['severity']})"
                    for a in user_context["recent_assessments"]]
            )

        history = "\n".join(
            [f"{m['role'].upper()}: {m['content']}"
                for m in conversation_history[-3:]]
        )

        prompt = f"""
You are Shvayam — a warm, compassionate AI psychiatrist who speaks like a caring human therapist.
Your ONLY job is to write a short, supportive reply to the user.
STRICT RULES:
- Output ONLY the reply (2–3 sentences).
- NO labels, NO tags, NO explanations.
- NO repeating the prompt or conversation.
- NO JSON, bullet points, or formatting.
- NO therapist disclaimers like "As an AI".
- Keep your tone gentle, validating, human, and emotionally warm.

Here is the person saved data :
User Mood: {user_context.get('recent_mood', 'N/A')}
Assessments:
{assessments_summary}

Recent Chat (summary only):
{history}

User says: "{user_message}"

Now respond with ONLY the reply in natural human language according to User says:
"""


        outputs = local_llm_pipeline(
            prompt,
            max_new_tokens=200,
            temperature=0.7,
            do_sample=True,
            top_p=0.9
        )

        if outputs and isinstance(outputs, list) and len(outputs) > 0 and outputs[0].get("generated_text"):
            full_text = outputs[0]["generated_text"]
            # Find the start of the generated response
            response_start_index = full_text.find("<response>")
            if response_start_index != -1:
                # Extract from <response> to the end
                reply = full_text[response_start_index + len("<response>"):].strip()
                # If the model generates a closing tag, remove it
                if reply.endswith("</response>"):
                    reply = reply[:-len("</response>")].strip()
            else:
                # Fallback to old method if <response> tag is not found
                reply = full_text.replace(prompt, "").strip()
        else:
            print(f"[WARN] Unexpected output from LLM pipeline: {outputs}")
            reply = "I'm sorry, I couldn't generate a response right now. Could you try rephrasing?"

        # ✅ Clean up: remove code fences, JSON, print(), etc.
        reply = re.sub(r"```.*?```", "", reply, flags=re.DOTALL).strip()
        reply = re.sub(r"^json", "", reply, flags=re.IGNORECASE).strip()

        # Try parsing JSON and extracting message
        try:
            data = json.loads(reply)
            if isinstance(data, dict) and "response" in data:
                reply = data["response"]
            elif isinstance(data, list) and data and "response" in data[0]:
                reply = data[0]["response"]
        except json.JSONDecodeError:
            # Not JSON — continue normally
            pass

        # Final cleanup
        reply = re.sub(r"^(response|output|answer|text)[:\s-]*", "", reply, flags=re.IGNORECASE).strip()
        reply = reply.strip('"\'')

        if not reply:
            reply = "It’s okay to ask for help. I’m listening — what’s been troubling you?"

        add_message_to_user_history(user_id, user_message, reply)

        analysis = analyze_message(user_message, user_context)
        return reply, analysis

    except Exception as e:
        print(f"[ERROR] Response generation failed: {e}")
        return (
            "That sounds difficult. I’m here for you — let’s take it one step at a time.",
            {"error": str(e)},
        )




# ===========================
# STARTUP
# ===========================

initialize_vector_store()
print("[READY ✅] PsyMitrix AI initialized successfully.")
