import { z } from 'zod';

// Student Registration Validation
export const studentRegistrationSchema = z.object({
    fullName: z.string().min(2).max(255),
    studentId: z.string().min(1).max(100),
    qualification: z.string().min(10),
    gender: z.enum(['male', 'female', 'other']),
    address: z.string().min(10),
    contactNo: z.string().min(10).max(20),
    email: z.string().email(),
    password: z.string().min(8),
});

// Company Registration Validation
export const companyRegistrationSchema = z.object({
    companyName: z.string().min(2).max(255),
    employerPost: z.string().min(2).max(255),
    address: z.string().min(10),
    businessType: z.string().min(2).max(255),
    contactDetails: z.string().min(10).max(255),
    introduction: z.string().min(20),
    email: z.string().email(),
    password: z.string().min(8),
});

// Admin Registration Validation
export const adminRegistrationSchema = z.object({
    name: z.string().min(2).max(255),
    email: z.string().email(),
    password: z.string().min(8),
    adminSecret: z.string(),
    position: z.string().min(2).max(255),
});

// Login Validation
export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

// Job Posting Validation
export const jobPostingSchema = z.object({
    category: z.string().min(2).max(255),
    title: z.string().min(5).max(255),
    salary: z.string().optional(),
    timings: z.string().optional(),
    requiredQualifications: z.string().min(10),
    requiredExperience: z.string().optional(),
    description: z.string().min(20),
    location: z.string().min(2).max(255),
});

// CV Review Validation
export const cvReviewSchema = z.object({
    status: z.enum(['approved', 'rejected']),
    rejectionReason: z.string().optional(),
});

// Application Status Update Validation
export const applicationStatusSchema = z.object({
    status: z.enum(['accepted', 'rejected']),
});

// File validation helpers
export const isValidFileType = (mimetype, allowedTypes) => {
    return allowedTypes.includes(mimetype);
};

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
export const ALLOWED_DOCUMENT_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
