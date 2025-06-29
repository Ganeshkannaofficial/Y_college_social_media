import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// USER AUTH
export const signupUser = (data) => API.post('/auth/signup', data);
export const loginUser = (data) => API.post('/auth/login', data);

// ADMIN AUTH
export const adminLogin = (data) => API.post('/auth/admin/login', data);


// ADMIN DASHBOARD ACTIONS
export const fetchPendingUsers = (token) =>
  API.get('/admin/pending-users', {
    headers: { Authorization: `Bearer ${token}` },
  });

export const approveUser = (userId, token) =>
  API.post(`/admin/approve-user/${userId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
