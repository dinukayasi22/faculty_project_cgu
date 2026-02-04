import { Router } from 'express';
import {
  getAllStudents,
  getAllCompanies,
  reviewStudentCV,
  approveCompany,
  rejectCompany,
  deleteStudent,
  deleteCompany,
} from '../controllers/adminController.js';
import {
  createBlogPost,
  getAllBlogPosts,
  getBlogPostById,
  updateBlogPost,
  deleteBlogPost,
  uploadInlineImage,
} from '../controllers/blogController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// All routes require authentication as admin
router.use(authenticate);
router.use(authorize('admin'));

// View all users
router.get('/students', getAllStudents);
router.get('/companies', getAllCompanies);

// Student CV review
router.put('/students/:studentId/cv', reviewStudentCV);

// Company approval
router.put('/companies/:companyId/approve', approveCompany);
router.put('/companies/:companyId/reject', rejectCompany);

// User deletion
router.delete('/students/:studentId', deleteStudent);
router.delete('/companies/:companyId', deleteCompany);

// Blog post inline image upload (for Quill editor)
router.post(
  '/blog-posts/upload-inline-image',
  upload.fields([{ name: 'image', maxCount: 1 }]),
  uploadInlineImage
);

// Blog post management
router.post(
  '/blog-posts',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'attachments', maxCount: 5 },
  ]),
  createBlogPost
);
router.get('/blog-posts', getAllBlogPosts);
router.get('/blog-posts/:postId', getBlogPostById);
router.put(
  '/blog-posts/:postId',
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'attachments', maxCount: 5 },
  ]),
  updateBlogPost
);
router.delete('/blog-posts/:postId', deleteBlogPost);

export default router;
