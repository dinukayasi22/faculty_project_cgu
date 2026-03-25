import axios from 'axios';

// Base API URL - update this to match your backend
const API_BASE_URL = 'http://localhost:5000';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('userRole');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    registerAdmin: (data) => api.post('/auth/register-admin', data),
    loginAdmin: (credentials) => api.post('/auth/login-admin', credentials),
};

// Admin API
export const adminAPI = {
    getAllStudents: () => api.get('/admin/students'),
    getAllCompanies: () => api.get('/admin/companies'),
    reviewStudentCV: (studentId, data) => api.put(`/admin/students/${studentId}/cv`, data),
    approveCompany: (companyId) => api.put(`/admin/companies/${companyId}/approve`),
    rejectCompany: (companyId) => api.put(`/admin/companies/${companyId}/reject`),
    deleteStudent: (studentId) => api.delete(`/admin/students/${studentId}`),
    deleteCompany: (companyId) => api.delete(`/admin/companies/${companyId}`),

    // Blog management
    createBlogPost: (formData) => api.post('/admin/blog-posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    getAllBlogPosts: () => api.get('/admin/blog-posts'),
    getBlogPost: (postId) => api.get(`/admin/blog-posts/${postId}`),
    updateBlogPost: (postId, formData) => api.put(`/admin/blog-posts/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    deleteBlogPost: (postId) => api.delete(`/admin/blog-posts/${postId}`),
    uploadInlineImage: (formData) => api.post('/admin/blog-posts/upload-inline-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Helper functions
export const setAuthToken = (token) => {
    localStorage.setItem('token', token);
};

export const removeAuthToken = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const setUserData = (user, role) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userRole', role);
};

export const getUserData = () => {
    const user = localStorage.getItem('user');
    const role = localStorage.getItem('userRole');
    return { user: user ? JSON.parse(user) : null, role };
};

export default api;
