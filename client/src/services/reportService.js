import api from './api';

export const reportService = {
  getSummary: async (params = {}) => {
    const response = await api.get('/reports/summary', { params });
    return response.data;
  },

  getAdminDashboardStats: async () => {
    const response = await api.get('/reports/dashboard-stats');
    return response.data;
  },
};

export default reportService;
