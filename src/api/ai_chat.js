import api from './index';

const AI_CHAT_BASE = '/ai_chat';

export const aiChatAPI = {
  // Send message to AI psychiatrist
  sendMessage: async (message, conversationId = null) => {
    try {
      const response = await api.post(`${AI_CHAT_BASE}/message`, {
        message,
        conversation_id: conversationId
      });
      return response.data?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
  },

  // Get chat history
  getChatHistory: async (limit = 50) => {
    try {
      const response = await api.get(`${AI_CHAT_BASE}/history`, {
        params: { limit }
      });
      return response.data?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch chat history');
    }
  },

  // Clear chat history
  clearChatHistory: async () => {
    try {
      const response = await api.delete(`${AI_CHAT_BASE}/history`);
      return response.data?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to clear chat history');
    }
  }
};
