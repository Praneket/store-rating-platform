import api from './axios';

export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getMe: () => api.get('/auth/me'),
  updatePassword: (data) => api.put('/auth/password', data),
};

export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  getStats: () => api.get('/users/stats'),
};

export const storeAPI = {
  getAll: (params) => api.get('/stores', { params }),
  getById: (id) => api.get(`/stores/${id}`),
  create: (data) => api.post('/stores', data),
  update: (id, data) => api.put(`/stores/${id}`, data),
  delete: (id) => api.delete(`/stores/${id}`),
  getOwnerDashboard: () => api.get('/stores/owner/dashboard'),
};

export const ratingAPI = {
  submit: (data) => api.post('/ratings', data),
  getMyRatings: () => api.get('/ratings/my'),
};
