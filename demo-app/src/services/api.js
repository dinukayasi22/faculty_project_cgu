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
    // Student
    registerStudent: (formData) => api.post('/auth/register-student', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    loginStudent: (credentials) => api.post('/auth/login-student', credentials),

    // Company
    registerCompany: (formData) => api.post('/auth/register-company', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    loginCompany: (credentials) => api.post('/auth/login-company', credentials),

    // Admin
    registerAdmin: (data) => api.post('/auth/register-admin', data),
    loginAdmin: (credentials) => api.post('/auth/login-admin', credentials),
};

// Student API
export const studentAPI = {
    getProfile: () => api.get('/students/profile'),
    updateProfile: (data) => api.put('/students/profile', data),
    updateCV: (formData) => api.put('/students/cv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    }),
    deleteAccount: (password) => api.delete('/students/account', { data: { password } }),
    getJobs: () => api.get('/students/jobs'),
    applyForJob: (jobId) => api.post(`/students/apply/${jobId}`),
    getMyApplications: () => api.get('/students/applications'),
    deleteApplication: (applicationId) => api.delete(`/students/applications/${applicationId}`),
};

// Company API
export const companyAPI = {
    getProfile: () => api.get('/companies/profile'),
    updateProfile: (data) => api.put('/companies/profile', data),
    deleteAccount: (password) => api.delete('/companies/account', { data: { password } }),
    postJob: (data) => api.post('/companies/jobs', data),
    getMyJobs: () => api.get('/companies/jobs'),
    updateJob: (jobId, data) => api.put(`/companies/jobs/${jobId}`, data),
    deleteJob: (jobId) => api.delete(`/companies/jobs/${jobId}`),
    getJobApplicants: (jobId) => api.get(`/companies/jobs/${jobId}/applicants`),
    updateApplicationStatus: (applicationId, status) =>
        api.put(`/companies/applications/${applicationId}`, { status }),
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

// Public API (no auth required)
export const publicAPI = {
    getAllJobs: () => api.get('/jobs'),
    getJobDetails: (jobId) => api.get(`/jobs/${jobId}`),
    getAllBlogPosts: () => api.get('/blog'),
    getBlogPost: (postId) => api.get(`/blog/${postId}`),
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
