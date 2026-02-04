import { Router } from 'express';
import {
    registerStudent,
    registerCompany,
    registerAdmin,
    loginStudent,
    loginCompany,
    loginAdmin,
} from '../controllers/authController.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// Student registration with file uploads
router.post(
    '/register-student',
    upload.fields([
        { name: 'cv', maxCount: 1 },
        { name: 'pdcTable', maxCount: 1 },
        { name: 'profilePicture', maxCount: 1 },
    ]),
    registerStudent
);

// Company registration with logo upload
router.post(
    '/register-company',
    upload.fields([{ name: 'logo', maxCount: 1 }]),
    registerCompany
);

// Admin registration (requires admin secret)
router.post('/register-admin', registerAdmin);

// Login routes
router.post('/login-student', loginStudent);
router.post('/login-company', loginCompany);
router.post('/login-admin', loginAdmin);

export default router;
