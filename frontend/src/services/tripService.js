import api from './api';

export const tripService = {
  generate: (data) => api.post('/trips', data),
  getAll: (params) => api.get('/trips', { params }),
  getById: (id) => api.get(`/trips/${id}`),
  delete: (id) => api.delete(`/trips/${id}`),
  regenerate: (id) => api.post(`/trips/${id}/regenerate`),
};
