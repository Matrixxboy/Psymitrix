const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Type definitions
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  session_id?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count?: number;
  last_message?: string;
}

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

export const sendChatMessage = async (message: string, sessionId: string | null = null) => {
  try {
    console.log("Sending message:", message);
    const response = await fetch(`${API_BASE_URL}/chat/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ 
        message,
        session_id: sessionId 
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to send message:", error);
      throw new Error(error.detail || "Failed to send message");
    }

    const data = await response.json();
    console.log("Message sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

export const getChatSessions = async (): Promise<ChatSession[]> => {
  try {
    console.log("Fetching chat sessions...");
    const response = await fetch(`${API_BASE_URL}/chat/sessions`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to fetch chat sessions:", error);
      throw new Error(error.detail || "Failed to fetch chat sessions");
    }

    const data = await response.json();
    console.log("Received chat sessions:", data);
    return data;
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    throw error;
  }
};

export const getChatHistory = async (sessionId: string): Promise<ChatMessage[]> => {
  try {
    console.log(`Fetching chat history for session ${sessionId}`);
    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to fetch chat history:", error);
      throw new Error(error.detail || "Failed to fetch chat history");
    }

    const data = await response.json();
    console.log("Received chat history:", data);
    return data;
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

export const deleteChatSession = async (sessionId: string) => {
  try {
    console.log(`Deleting chat session ${sessionId}`);
    const response = await fetch(`${API_BASE_URL}/chat/sessions/${sessionId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Failed to delete chat session:", error);
      throw new Error(error.detail || "Failed to delete chat session");
    }

    const data = await response.json();
    console.log("Chat session deleted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error deleting chat session:", error);
    throw error;
  }
};

// Legacy exports for compatibility
export const createChatSession = async (): Promise<string> => {
  // The new backend creates sessions automatically when sending the first message
  // Return a placeholder that will be replaced by the actual session ID
  return "new-session";
};

export const getAllChatSessions = getChatSessions;
