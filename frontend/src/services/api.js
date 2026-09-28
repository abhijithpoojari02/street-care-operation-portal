import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
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

// -----------------------------
// Auth APIs
// -----------------------------
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const adminLogin = (credentials) => api.post('/auth/admin/login', credentials);

// ✅ Worker self-registration (used in WorkerRegister.jsx)
export const registerWorker = (workerData) =>
  api.post('/auth/worker/register', workerData);

export const workerLogin = (credentials) => api.post('/auth/worker/login', credentials);

// -----------------------------
// Issue APIs
// -----------------------------
export const createIssue = (formData) =>
  api.post('/issues', formData);

export const getUserIssues = () => api.get('/issues/my-issues');
export const getAllIssues = () => api.get('/issues');
export const updateIssueStatus = (id, status) => api.patch(`/issues/${id}/status`, { status });
export const assignWorker = (id, workerId) => api.patch(`/issues/${id}/assign`, { workerId });
export const submitFeedback = (id, feedback) => api.post(`/issues/${id}/feedback`, feedback);
export const getWorkerIssues = () => api.get('/issues/worker/assigned');

// Approve Worker API (admin action)
export const approveWorker = (workerId) =>
  api.patch(`/workers/${workerId}/approve`);

// -----------------------------
// Complaint APIs
// -----------------------------
export const createComplaint = (formData) =>
  api.post('/complaints', formData);

export const getUserComplaints = () => api.get('/complaints/my-complaints');
export const getAllComplaints = () => api.get('/complaints');
export const markActionTaken = (id, actionNotes) => api.patch(`/complaints/${id}/action`, { actionNotes });

// -----------------------------
// Worker APIs (admin CRUD / profile helpers)
// -----------------------------
export const createWorker = (workerData) => api.post('/workers', workerData); // admin-created worker
export const getAllWorkers = () => api.get('/workers');
export const updateWorker = (id, workerData) => api.put(`/workers/${id}`, workerData);
export const deleteWorker = (id) => api.delete(`/workers/${id}`);

export const getWorkerProfile = () => {
  return api.get('/workers/me');
};

export const updateWorkerProfile = (id, workerData) => {
  return api.put(`/workers/${id}`, workerData);
};

export const getWorkerDashboard = () => {
  return api.get('/workers/dashboard');
};

export const markIssueCompleted = (issueId, payload = {}) => {
  return api.patch(`/issues/${issueId}/status`, { status: 'completed', ...payload });
};

// -----------------------------
// Media / Uploads
// -----------------------------
export const createMediaPresign = (payload) => api.post('/media/presign', payload);
export const uploadMedia = (formData) =>
  api.post('/media/upload', formData);

// -----------------------------
// Analytics APIs
// -----------------------------
export const getAnalytics = () => api.get('/analytics');

// -----------------------------
// Export default
// -----------------------------
export default api;
