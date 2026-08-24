import api from './api';

export const employeeService = {
  getAll: async (params = {}) => {
    const response = await api.get('/employees', { params });
    return response.data;
  },

  create: async (payload) => {
    const response = await api.post('/employees', payload);
    return response.data;
  },

  update: async (id, payload) => {
    const response = await api.put(`/employees/${id}`, payload);
    return response.data;
  },
};

export default employeeService;
