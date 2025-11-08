import api from './index';

const ASSESSMENTS_BASE = '/assessments';

export const assessmentsAPI = {
  // Get PHQ-9 questions
  getPHQ9Questions: async () => {
    try {
      const response = await api.get(`${ASSESSMENTS_BASE}/phq9/questions`);
      return response.data?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch PHQ-9 questions');
    }
  },

  // Get GAD-7 questions
  getGAD7Questions: async () => {
    try {
      const response = await api.get(`${ASSESSMENTS_BASE}/gad7/questions`);
      return response.data?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch GAD-7 questions');
    }
  },

  // Submit assessment
  submitAssessment: async (assessmentType, responses) => {
    try {
      const response = await api.post(`${ASSESSMENTS_BASE}/submit`, {
        assessment_type: assessmentType,
        responses: responses.map((score, idx) => ({
          question_id: idx,
          question_text: '', // Filled server-side
          score: parseInt(score)
        }))
      });
      return response.data?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to submit assessment');
    }
  },

  // Get assessment results
  getAssessmentResults: async (assessmentType = null) => {
    try {
      const response = await api.get(`${ASSESSMENTS_BASE}/results`, {
        params: { assessment_type: assessmentType }
      });
      return response.data?.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch assessment results');
    }
  }
};
