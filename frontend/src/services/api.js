import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// User Auth
export const signupUser = (data) => API.post('/auth/signup', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const adminLogin = (data) => API.post('/auth/admin/login', data);

// Admin actions
export const fetchPendingUsers = (token) =>
  API.get('/admin/pending-users', { headers: { Authorization: `Bearer ${token}` } });

export const approveUser = (userId, token) =>
  API.post(`/admin/approve-user/${userId}`, {}, { headers: { Authorization: `Bearer ${token}` } });

// Comments
export const addComment = (data, token) =>
  API.post('/comments', data, { headers: { Authorization: `Bearer ${token}` } });

export const getComments = (postId) => API.get(`/comments/${postId}`);

// React to post
export const reactToPost = (postId, reaction, token) => {
  return axios.post(
    `http://localhost:5000/api/posts/${postId}/react`,
    { reaction },
    { headers: { Authorization: `Bearer ${token}` } }
  );
};
