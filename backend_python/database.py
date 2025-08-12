from motor.motor_asyncio import AsyncIOMotorClient
import os
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

db = Database()

async def get_database():
    return db.database

async def connect_to_mongo():
    """Create database connection"""
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    database_name = os.getenv("DB_NAME", "ai_therapy_agent")
    
    db.client = AsyncIOMotorClient(mongodb_url)
    db.database = db.client[database_name]
    
    print(f"Connected to MongoDB at {mongodb_url}")

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")
