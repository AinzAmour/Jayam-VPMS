import api from './api';

export const userService = {
  getAll: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post('/users', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/users/${id}`, payload);
    return response.data;
  },
};

export default userService;
