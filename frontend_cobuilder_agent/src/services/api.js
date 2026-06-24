import axios from 'axios';
import { resolveApiBaseUrl } from './runtimeConfig';

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 8000,
});

api.interceptors.request.use((config) => {
  const raw = localStorage.getItem('cb-auth');
  if (raw) {
    try {
      const { state } = JSON.parse(raw);
      if (state?.token) config.headers.Authorization = `Bearer ${state.token}`;
    } catch {
      // ignore localStorage parse issue
    }
  }
  return config;
});

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
};

export const projectsAPI = {
  list: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  get: (id) => api.get(`/projects/${id}`),
  generate: (id, payload) => api.post(`/projects/${id}/generate`, payload),
  status: (id) => api.get(`/projects/${id}/status`),
  preview: (id) => api.get(`/projects/${id}/preview`),
  edit: (id, payload) => api.post(`/projects/${id}/edits`, payload),
  versions: (id) => api.get(`/projects/${id}/versions`),
  followupQuestions: (id, payload) => api.post(`/projects/${id}/followup-questions`, payload),
};

export const aiAssistantAPI = {
  clarify: (id, payload) => api.post(`/projects/${id}/clarify`, payload),
};

export default api;
