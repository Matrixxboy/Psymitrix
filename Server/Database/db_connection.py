import os
import sys
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError
from dotenv import load_dotenv
import certifi

# --- Environment Variable Loading ---
# Load environment variables from a .env file
load_dotenv()

# --- MongoDB Connection Details ---
# It's crucial to ensure these environment variables are set correctly in your .env file
# or your deployment environment.
MONGO_DB_USER = os.getenv("MONGO_DB_USER")
MONGO_DB_PASSWORD = os.getenv("MONGO_DB_PASSWORD")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
MONGO_DB_HOST = os.getenv("MONGO_DB_HOST")

# --- Pre-connection Validation ---
# Check if essential environment variables are loaded. This helps catch configuration
# errors early.
missing_vars = []
if not MONGO_DB_USER:
    missing_vars.append("MONGO_DB_USER")
if not MONGO_DB_PASSWORD:
    missing_vars.append("MONGO_DB_PASSWORD")
if not MONGO_DB_NAME:
    missing_vars.append("MONGO_DB_NAME")
if not MONGO_DB_HOST:
    missing_vars.append("MONGO_DB_HOST")

if missing_vars:
    print(f"❌ Critical Error: Missing environment variables: {', '.join(missing_vars)}")
    print("👉 Please create a .env file in the root directory with the required variables.")
    sys.exit(1)  # Exit the application if the configuration is invalid

# --- MongoDB Connection URI ---
# Constructs the MongoDB connection string. Using mongodb+srv is standard for Atlas.
MONGO_URI = f"mongodb+srv://{MONGO_DB_USER}:{MONGO_DB_PASSWORD}@{MONGO_DB_HOST}/?retryWrites=true&w=majority"

# --- Global MongoDB Client ---
# This will hold our database connection.
mongo_client = None
mongo_db = None

# --- Database Connection Function ---
def connect_to_mongo():
    """
    Establishes a connection to MongoDB using environment variables.
    Handles errors gracefully and provides informative feedback.
    """
    global mongo_client, mongo_db
    try:
        print("⏳ Attempting to connect to MongoDB Atlas...")
        # MongoClient with certifi is the most robust way to handle TLS/SSL across
        # different operating systems (Windows, macOS, Linux).
        mongo_client = MongoClient(
            MONGO_URI,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=10000  # 10-second timeout
        )
        # The ismaster command is cheap and does not require auth.
        mongo_client.admin.command('ismaster')
        mongo_db = mongo_client[MONGO_DB_NAME]
        print("✅ MongoDB connected successfully!")
        
    except ConfigurationError as e:
        print(f"❌ Configuration Error: {e}")
        print("👉 Check your MONGO_URI string and environment variables.")
        mongo_db = None
    except ConnectionFailure as e:
        print(f"❌ MongoDB Connection Failed: {e}")
        print("👉 Common Fixes:")
        print("   1. Verify your internet connection.")
        print("   2. Check if your IP is whitelisted in MongoDB Atlas.")
        print("   3. Ensure your environment variables (USER, PASSWORD, HOST) are correct.")
        mongo_db = None
    except Exception as e:
        print(f"❌ An unexpected error occurred: {e}")
        mongo_db = None

# --- Application Startup Connection ---
# This function is called when the application starts.
connect_to_mongo()

# --- Dependency for FastAPI ---
def get_mongo_db():
    """
    Returns the MongoDB database instance.
    This is used for dependency injection in FastAPI routes.
    """
    return mongo_db

# --- Health Check Function ---
def check_database_connection():
    """
    Performs a quick check to see if the database is connected.
    Returns True if connected, False otherwise.
    """
    if mongo_client is not None and mongo_db is not None:
        try:
            # A quick command to verify the connection is still alive.
            mongo_client.admin.command('ping')
            return True
        except ConnectionFailure:
            return False
    return False

# --- Vector DB Placeholder ---
def get_vector_db_connection():
    """Placeholder for future vector database integration (e.g., Pinecone)."""
    pass

# --- Debug Info ---
if check_database_connection():
    print(f"MongoDB Connection Status: Connected to database '{MONGO_DB_NAME}'")
else:
    print("MongoDB Connection Status: Not Connected")
