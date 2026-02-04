import { Router } from 'express';
import {
    getProfile,
    updateProfile,
    updateCV,
    deleteAccount,
    getAvailableJobs,
    applyForJob,
    getMyApplications,
    deleteApplication,
} from '../controllers/studentController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// All routes require authentication as student
router.use(authenticate);
router.use(authorize('student'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// CV update (if rejected)
router.put('/cv', upload.fields([{ name: 'cv', maxCount: 1 }]), updateCV);

// Account deletion
router.delete('/account', deleteAccount);

// Job browsing and application
router.get('/jobs', getAvailableJobs);
router.post('/apply/:jobId', applyForJob);
router.get('/applications', getMyApplications);
router.delete('/applications/:applicationId', deleteApplication);

export default router;
