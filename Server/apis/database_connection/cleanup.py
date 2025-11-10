import chromadb
from chromadb.config import Settings

def cleanup_user_chromadb_collection(user_id: str):
    """
    Deletes the user-specific ChromaDB collection.
    """
    try:
        # It's better to initialize a client here than to import from another service
        chroma_client = chromadb.PersistentClient(path="./chroma_db", settings=Settings(anonymized_telemetry=False))
        
        collection_name = f"user_{user_id.replace('-', '_')}_history"
        
        # Check if collection exists before trying to delete
        collections = chroma_client.list_collections()
        if any(c.name == collection_name for c in collections):
            chroma_client.delete_collection(name=collection_name)
            print(f"Successfully deleted ChromaDB collection for user {user_id}")
        else:
            print(f"No ChromaDB collection found for user {user_id}")
            
        return True
    except Exception as e:
        print(f"Error deleting ChromaDB collection for user {user_id}: {e}")
        return False