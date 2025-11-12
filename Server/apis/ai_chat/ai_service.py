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
    """Load PsyMitrix model with automatic 4-bit fallback."""
    try:
        print(f"[INFO] Loading your model: {MODEL_NAME}")
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME, use_fast=True)

        # Check for GPU availability
        has_gpu = torch.cuda.is_available()
        device_map = "auto" if has_gpu else None
        pipeline_device = 0 if has_gpu else -1

        try:
            # Try full FP16 first
            model = AutoModelForCausalLM.from_pretrained(
                MODEL_NAME,
                torch_dtype=torch.float16,
                device_map=device_map,
                trust_remote_code=True,
                low_cpu_mem_usage=True
            )
            print(f"[INFO] Model loaded in FP16 successfully on {'GPU' if has_gpu else 'CPU'}.")
        except RuntimeError as oom_error:
            print("[WARN] Out of memory loading in FP16 — switching to 4-bit quantization.")
            bnb_config = BitsAndBytesConfig(
                load_in_4bit=True,
                bnb_4bit_compute_dtype=torch.float16,
                bnb_4bit_quant_type="nf4"
            )
            model = AutoModelForCausalLM.from_pretrained(
                MODEL_NAME,
                device_map=device_map,
                quantization_config=bnb_config,
                trust_remote_code=True,
                low_cpu_mem_usage=True
            )
            print(f"[INFO] Model loaded in 4-bit successfully on {'GPU' if has_gpu else 'CPU'}.")


        llm_pipeline = pipeline(
            "text-generation",
            model=model,
            tokenizer=tokenizer,
            torch_dtype=torch.float16,
            device=pipeline_device,
            temperature=0.6,
            top_p=0.9,
            repetition_penalty=1.1
        )
        print("[INFO] PsyMitrix LLM loaded and ready.")
        return llm_pipeline

    except Exception as e:
        print(f"[ERROR] Failed to load model: {e}")
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
        return "error no llm"

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

        # ✅ Updated prompt: instruct model to give plain text
        prompt = f"""You are Shvayam — a compassionate, professional AI psychiatrist. 
Respond like a warm, caring human therapist. 

Do not include:
- Any labels like “BOT:”, “Shvayam:”, or “AI:”
- Any JSON, code blocks, quotes, or special formatting
- Any explanations about what you’re doing

Context:
User Mood: {user_context.get('recent_mood', 'N/A')}
Assessments: {assessments_summary}
Recent Chat: {history}

User says: {user_message}

Now reply directly to the user in natural human language with empathy, insight, and emotional warmth.
Your output must be ONLY the message — no other text or formatting.
"""

        outputs = local_llm_pipeline(
            prompt,
            max_new_tokens=200,
            temperature=0.7,
            do_sample=True,
            top_p=0.9
        )

        if outputs and outputs[0].get("generated_text"):
            reply = outputs[0]["generated_text"].replace(prompt, "").strip()
        else:
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
