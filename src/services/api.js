import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Celebrity API
export const celebrityAPI = {
  getAll: (params = {}) => api.get('/celebrities', { params }),
  getById: (id) => api.get(`/celebrities/${id}`),
  getByProvince: (province) => api.get(`/celebrities/province/${province}`),
  getNearby: (lng, lat, distance = 50000) => 
    api.get('/celebrities/nearby', { params: { lng, lat, distance } }),
  
  // Admin only
  create: (data) => api.post('/celebrities', data),
  update: (id, data) => api.put(`/celebrities/${id}`, data),
  delete: (id) => api.delete(`/celebrities/${id}`),
};

// Game API
export const gameAPI = {
  saveScore: (scoreData) => api.post('/games/score', scoreData),
  getMyScores: (params = {}) => api.get('/games/my-scores', { params }),
  getLeaderboard: (params = {}) => api.get('/games/leaderboard', { params }),
  getStats: () => api.get('/games/stats'),
};

// User API (Admin only)
export const userAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// Premium API
export const premiumAPI = {
  createRequest: (data) => api.post('/premium/request', data),
  getMyRequests: () => api.get('/premium/my-requests'),
  getAllRequests: (params = {}) => api.get('/premium/requests', { params }),
  processRequest: (id, data) => api.put(`/premium/requests/${id}`, data),
  deleteRequest: (id) => api.delete(`/premium/requests/${id}`),
};

export default api;
