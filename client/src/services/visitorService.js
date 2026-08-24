import api from './api';

export const visitorService = {
  register: async (payload) => {
    const response = await api.post('/visitors', payload);
    return response.data;
  },

  getAll: async (params = {}) => {
    const response = await api.get('/visitors', { params });
    return response.data;
  },

  getTodayQueue: async () => {
    const response = await api.get('/visitors/today-queue');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/visitors/${id}`);
    return response.data;
  },

  updateStatus: async (id, action, remarks) => {
    const response = await api.put(`/visitors/${id}/status`, { action, remarks });
    return response.data;
  },

  checkIn: async (id) => {
    const response = await api.put(`/visitors/${id}/checkin`);
    return response.data;
  },

  checkOut: async (id) => {
    const response = await api.put(`/visitors/${id}/checkout`);
    return response.data;
  },

  cancel: async (id, reason) => {
    const response = await api.put(`/visitors/${id}/cancel`, { reason });
    return response.data;
  },

  getActivities: async (id) => {
    const response = await api.get(`/visitors/${id}/activities`);
    return response.data;
  },

  getEmployeeDashboardStats: async () => {
    const response = await api.get('/visitors/employee-stats');
    return response.data;
  },
};

export default visitorService;
