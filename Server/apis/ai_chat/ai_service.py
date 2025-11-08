import os
from typing import Tuple, List, Dict, Optional
from langchain.chains import RetrievalQA
from langchain.llms import HuggingFaceHub
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
import json
from datetime import datetime

# Initialize HuggingFace API
HF_API_TOKEN = "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"
os.environ["HUGGINGFACEHUB_API_TOKEN"] = HF_API_TOKEN

# Mental health knowledge base for Chroma
MENTAL_HEALTH_KNOWLEDGE = [
    "Cognitive Behavioral Therapy (CBT) helps identify and change negative thought patterns and behaviors.",
    "Depression is characterized by persistent sadness, loss of interest, and changes in sleep or appetite.",
    "Anxiety disorders involve excessive worry that interferes with daily functioning.",
    "Mindfulness and meditation can reduce anxiety and improve emotional regulation.",
    "Regular exercise has been shown to improve mood and reduce symptoms of depression and anxiety.",
    "Sleep hygiene includes maintaining consistent sleep schedules and avoiding screens before bed.",
    "Social support is crucial for mental health recovery and resilience.",
    "Professional help from therapists or counselors should be sought for severe mental health conditions.",
    "Breathing exercises like 4-7-8 breathing can help manage acute anxiety.",
    "Journaling can help process emotions and identify thought patterns.",
    "Boundary setting is important for protecting mental health in relationships.",
    "Self-compassion is as important as treating others with kindness.",
    "Crisis resources: National Suicide Prevention Lifeline 988, Crisis Text Line text HOME to 741741",
]

# Initialize vector store (Chroma)
vector_store = None

def initialize_vector_store():
    """Initialize Chroma vector store with mental health knowledge"""
    global vector_store
    try:
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        # Create or load vector store
        vector_store = Chroma.from_texts(
            texts=MENTAL_HEALTH_KNOWLEDGE,
            embedding=embeddings,
            persist_directory="./chroma_db",
            collection_name="mental_health"
        )
        return vector_store
    except Exception as e:
        print(f"Error initializing vector store: {e}")
        return None

async def get_ai_response(
    user_message: str,
    user_context: Dict,
    conversation_history: List[Dict]
) -> Tuple[str, Dict]:
    """
    Generate AI response with context-aware mental health advice
    
    Args:
        user_message: The user's message
        user_context: Dictionary with user's mental health info
        conversation_history: Previous conversation messages
    
    Returns:
        Tuple of (ai_response, analysis_dict)
    """
    try:
        # Initialize vector store if not already done
        global vector_store
        if vector_store is None:
            vector_store = initialize_vector_store()
        
        # Initialize HuggingFace LLM
        llm = HuggingFaceHub(
            repo_id="mistralai/Mistral-7B-Instruct-v0.1",
            model_kwargs={"temperature": 0.7, "max_length": 512},
            huggingfacehub_api_token=HF_API_TOKEN
        )
        
        # Initialize embeddings
        embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        
        # Create retrieval chain
        retrieval_qa = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
            return_source_documents=False
        )
        
        # Build context prompt
        context_prompt = f"""You are a compassionate, empathetic AI psychiatrist assistant. Your role is to:
1. Listen actively and validate the user's feelings
2. Provide evidence-based mental health advice
3. Suggest coping strategies appropriate to their situation
4. Recognize warning signs and recommend professional help when needed
5. Be warm, non-judgmental, and supportive

User Context:
- Mental Health History: {user_context.get('mental_health_history', 'Not specified')}
- Recent Mood: {user_context.get('recent_mood', 'Not recorded')}
- Age: {user_context.get('age', 'Not specified')}
- Gender: {user_context.get('gender', 'Not specified')}
- Recent Assessments: {json.dumps(user_context.get('recent_assessments', []), indent=2)}

Conversation History (last 3 messages):
"""
        
        # Add recent conversation history
        for msg in conversation_history[-3:]:
            context_prompt += f"\n{msg['role'].upper()}: {msg['content']}"
        
        context_prompt += f"\n\nUser's current message: {user_message}"
        context_prompt += "\n\nProvide a supportive, evidence-based response that acknowledges their feelings, offers practical advice, and maintains therapeutic boundaries. Keep response concise (2-3 sentences max)."
        
        # Get retrieval-augmented response
        response = retrieval_qa.run(context_prompt)
        
        # Analyze sentiment and severity
        analysis = analyze_message(user_message, user_context)
        
        return response.strip(), analysis
        
    except Exception as e:
        # Fallback response if AI service fails
        fallback_response = f"I'm here to listen. It sounds like you're going through something challenging. Could you tell me more about what's on your mind? I'm here to help."
        return fallback_response, {"error": str(e)}

def analyze_message(message: str, user_context: Dict) -> Dict:
    """
    Analyze user message for emotional content and mental health indicators
    """
    analysis = {
        "severity_level": "low",
        "emotional_keywords": [],
        "recommended_action": "continue_support"
    }
    
    # Keywords for different severity levels
    crisis_keywords = ["suicide", "kill myself", "self harm", "overdose", "want to die", "end it all"]
    severe_keywords = ["depressed", "anxious", "panic", "overwhelming", "can't cope", "hopeless"]
    moderate_keywords = ["sad", "worried", "stressed", "tired", "frustrated", "lonely"]
    
    message_lower = message.lower()
    
    # Check for crisis indicators
    if any(keyword in message_lower for keyword in crisis_keywords):
        analysis["severity_level"] = "critical"
        analysis["recommended_action"] = "crisis_resources"
        analysis["emotional_keywords"] = crisis_keywords
    elif any(keyword in message_lower for keyword in severe_keywords):
        analysis["severity_level"] = "severe"
        analysis["recommended_action"] = "professional_help"
    elif any(keyword in message_lower for keyword in moderate_keywords):
        analysis["severity_level"] = "moderate"
        analysis["recommended_action"] = "continue_support"
    
    analysis["timestamp"] = datetime.utcnow().isoformat()
    
    return analysis
