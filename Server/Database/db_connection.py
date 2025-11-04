from pymongo import MongoClient
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# MongoDB connection details
MONGO_DB_USER = os.getenv("MONGO_DB_USER", "your_user")
MONGO_DB_PASSWORD = os.getenv("MONGO_DB_PASSWORD", "your_password")
MONGO_DB_HOST = os.getenv("MONGO_DB_HOST", "localhost")
# MONGO_DB_PORT = os.getenv("MONGO_DB_PORT", "27017")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "your_mongodb_database")

# Build MongoDB connection URI
# Example: mongodb://user:password@host:port/dbname
MONGO_URI = f"mongodb+srv://{MONGO_DB_USER}:{MONGO_DB_PASSWORD}@main.gelbtgw.mongodb.net/{MONGO_DB_NAME}"

# Create MongoDB client
try:
    mongo_client = MongoClient(MONGO_URI)
    mongo_db = mongo_client[MONGO_DB_NAME]
    print("✅ MongoDB connected successfully!")
except Exception as e:
    print("❌ MongoDB connection failed:", e)
    mongo_db = None

# Dependency function for FastAPI (or general use)
def get_mongo_db():
    """Return MongoDB database instance for dependency injection"""
    return mongo_db

# Vector DB placeholder
def get_vector_db_connection():
    # Example placeholder for Pinecone, Faiss, etc.
    pass

connection = get_mongo_db()
print(f"MongoDB Connection: {connection}")