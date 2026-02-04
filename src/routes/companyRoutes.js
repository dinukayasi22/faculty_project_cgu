import { Router } from 'express';
import {
    getProfile,
    updateProfile,
    deleteAccount,
    postJob,
    getMyJobs,
    updateJob,
    deleteJob,
    getJobApplicants,
    updateApplicationStatus,
} from '../controllers/companyController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

// All routes require authentication as company
router.use(authenticate);
router.use(authorize('company'));

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Account deletion
router.delete('/account', deleteAccount);

// Job posting routes
router.post('/jobs', postJob);
router.get('/jobs', getMyJobs);
router.put('/jobs/:jobId', updateJob);
router.delete('/jobs/:jobId', deleteJob);

// Applicant management
router.get('/jobs/:jobId/applicants', getJobApplicants);
router.put('/applications/:applicationId', updateApplicationStatus);

export default router;
