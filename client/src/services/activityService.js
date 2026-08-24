import api from './api';

export const activityService = {
  getAll: async (params = {}) => {
    const response = await api.get('/activities', { params });
    return response.data;
  },
};

export default activityService;
