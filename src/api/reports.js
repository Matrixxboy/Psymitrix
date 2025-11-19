import api from './index';

const AI_REPORTS_BASE = '/ai_report';

export const reportsAPI = {
  generateReport: async () => {
    try {
      const response = await api.post(`${AI_REPORTS_BASE}/ai_generate_report`, {}, {
        responseType: 'blob', // Important for file downloads
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;

      // Extract filename from content-disposition header
      const contentDisposition = response.headers['content-disposition'];
      let filename = `personality_base_report.pdf`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch.length > 1) {
          filename = filenameMatch[1];
        }
      }

      link.setAttribute('download', filename);
      
      // Append to html link element page
      document.body.appendChild(link);
      
      // Start download
      link.click();
      
      // Clean up and remove the link
      link.parentNode.removeChild(link);

      return { file_name: filename, generated_at: new Date() };
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to generate report');
    }
  },
};
