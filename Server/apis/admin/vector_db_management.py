import os
import json
from typing import List, Dict, Any
from fastapi import UploadFile, HTTPException
from pathlib import Path
import PyPDF2
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
import chromadb
from chromadb.config import Settings

load_dotenv()

CHROMA_PATH = "./chroma_db"
EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
ADMIN_COLLECTION_NAME = "admin_knowledge_base"

def initialize_admin_vector_store():
    """Initialize admin knowledge base vector store"""
    try:
        settings = Settings(anonymized_telemetry=False)
        chroma_client = chromadb.PersistentClient(path=CHROMA_PATH, settings=settings)
        embeddings = HuggingFaceEmbeddings(model_name=EMBED_MODEL)
        vector_store = Chroma(
            client=chroma_client,
            collection_name=ADMIN_COLLECTION_NAME,
            embedding_function=embeddings
        )
        return vector_store, chroma_client
    except Exception as e:
        print(f"[ERROR] Failed to initialize admin vector store: {e}")
        return None, None

async def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF file"""
    try:
        text = ""
        with open(file_path, 'rb') as pdf_file:
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            for page_num in range(len(pdf_reader.pages)):
                page = pdf_reader.pages[page_num]
                text += page.extract_text()
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract PDF text: {str(e)}")

async def extract_text_from_txt(file_path: str) -> str:
    """Extract text from TXT file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as txt_file:
            return txt_file.read()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read TXT file: {str(e)}")

async def extract_text_from_json(file_path: str) -> str:
    """Extract text from JSON file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as json_file:
            data = json.load(json_file)
            # Convert JSON to readable text format
            text = json.dumps(data, indent=2)
            return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read JSON file: {str(e)}")

async def extract_text_from_epub(file_path: str) -> str:
    """Extract text from EPUB file"""
    try:
        import ebooklib
        from ebooklib import epub
        
        book = epub.read_epub(file_path)
        text = ""
        
        for item in book.get_items():
            if item.get_type() == ebooklib.ITEM_DOCUMENT:
                text += item.get_content().decode('utf-8')
        
        # Basic HTML stripping
        import re
        text = re.sub('<[^<]+?>', '', text)
        
        return text
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read EPUB file: {str(e)}")

async def upload_and_index_document(
    file: UploadFile,
    document_type: str = None
) -> Dict[str, Any]:
    """Upload and index a document to vector DB"""
    try:
        vector_store, chroma_client = initialize_admin_vector_store()
        if not vector_store or not chroma_client:
            raise HTTPException(status_code=500, detail="Vector DB not available")
        
        # Determine file type
        file_extension = Path(file.filename).suffix.lower()
        
        if document_type is None:
            if file_extension == '.pdf':
                document_type = 'pdf'
            elif file_extension == '.txt':
                document_type = 'txt'
            elif file_extension == '.json':
                document_type = 'json'
            elif file_extension == '.epub':
                document_type = 'epub'
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_extension}")
        
        # Save uploaded file temporarily
        temp_dir = "/tmp"
        temp_file_path = os.path.join(temp_dir, file.filename)
        
        with open(temp_file_path, 'wb') as f:
            content = await file.read()
            f.write(content)
        
        # Extract text based on file type
        if document_type == 'pdf':
            text = await extract_text_from_pdf(temp_file_path)
        elif document_type == 'txt':
            text = await extract_text_from_txt(temp_file_path)
        elif document_type == 'json':
            text = await extract_text_from_json(temp_file_path)
        elif document_type == 'epub':
            text = await extract_text_from_epub(temp_file_path)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported document type: {document_type}")
        
        # Split text into chunks
        text_splitter = CharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50,
            separator="\n"
        )
        chunks = text_splitter.split_text(text)
        
        if not chunks:
            raise HTTPException(status_code=400, detail="No text content found in document")
        
        # Add to vector store
        metadatas = [
            {
                "source": file.filename,
                "type": document_type,
                "chunk_index": i,
                "total_chunks": len(chunks)
            }
            for i in range(len(chunks))
        ]
        
        vector_store.add_texts(chunks, metadatas=metadatas)
        
        # Clean up temp file
        os.remove(temp_file_path)
        
        return {
            "success": True,
            "filename": file.filename,
            "document_type": document_type,
            "chunks_created": len(chunks),
            "total_characters": len(text),
            "message": f"Successfully indexed {file.filename} with {len(chunks)} chunks"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading document: {str(e)}")

async def remove_document_from_vector_db(document_name: str) -> Dict[str, Any]:
    """Remove a document from vector DB"""
    try:
        vector_store, chroma_client = initialize_admin_vector_store()
        if not vector_store or not chroma_client:
            raise HTTPException(status_code=500, detail="Vector DB not available")
        
        # Get collection
        collection = vector_store._collection
        
        # Delete documents with matching source
        try:
            collection.delete(where={"source": document_name})
            return {
                "success": True,
                "message": f"Successfully removed {document_name} from vector DB"
            }
        except Exception as e:
            # Try alternative deletion method
            collection.delete(where={"source": {"$eq": document_name}})
            return {
                "success": True,
                "message": f"Successfully removed {document_name} from vector DB"
            }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error removing document: {str(e)}")

async def list_vector_db_documents() -> Dict[str, Any]:
    """List all documents in vector DB"""
    try:
        vector_store, chroma_client = initialize_admin_vector_store()
        if not vector_store or not chroma_client:
            raise HTTPException(status_code=500, detail="Vector DB not available")
        
        collection = vector_store._collection
        
        # Get all documents
        all_documents = collection.get()
        
        # Group by source
        documents = {}
        if all_documents and all_documents.get("metadatas"):
            for metadata in all_documents["metadatas"]:
                source = metadata.get("source", "unknown")
                doc_type = metadata.get("type", "unknown")
                
                if source not in documents:
                    documents[source] = {
                        "type": doc_type,
                        "chunks": 0,
                        "added_at": None
                    }
                documents[source]["chunks"] += 1
        
        # Get vector store stats
        count = collection.count()
        
        return {
            "total_chunks": count,
            "total_documents": len(documents),
            "documents": documents
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error listing documents: {str(e)}")

async def search_vector_db(query: str, limit: int = 5) -> Dict[str, Any]:
    """Search vector DB for relevant documents"""
    try:
        vector_store, chroma_client = initialize_admin_vector_store()
        if not vector_store or not chroma_client:
            raise HTTPException(status_code=500, detail="Vector DB not available")
        
        # Search
        results = vector_store.similarity_search(query, k=limit)
        
        formatted_results = []
        for i, result in enumerate(results):
            formatted_results.append({
                "index": i + 1,
                "content": result.page_content[:200] + "..." if len(result.page_content) > 200 else result.page_content,
                "source": result.metadata.get("source", "unknown"),
                "type": result.metadata.get("type", "unknown"),
                "chunk_index": result.metadata.get("chunk_index", 0)
            })
        
        return {
            "query": query,
            "results_count": len(formatted_results),
            "results": formatted_results
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error searching vector DB: {str(e)}")

async def clear_vector_db() -> Dict[str, Any]:
    """Clear all documents from vector DB"""
    try:
        vector_store, chroma_client = initialize_admin_vector_store()
        if not vector_store or not chroma_client:
            raise HTTPException(status_code=500, detail="Vector DB not available")
        
        collection = vector_store._collection
        
        # Delete all documents
        collection.delete(where={})
        
        return {
            "success": True,
            "message": "Vector DB cleared successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error clearing vector DB: {str(e)}")
