import api from './api';

export const tripService = {
  generate:    (data)   => api.post('/trips', data),
  getAll:      (params) => api.get('/trips', { params }),
  getSaved:    (params) => api.get('/trips', { params: { ...params, saved: 'true' } }),
  getById:     (id)     => api.get(`/trips/${id}`),
  toggleSaved: (id)     => api.patch(`/trips/${id}/saved`),
  delete:      (id)     => api.delete(`/trips/${id}`),
  regenerate:  (id)     => api.post(`/trips/${id}/regenerate`),
};
