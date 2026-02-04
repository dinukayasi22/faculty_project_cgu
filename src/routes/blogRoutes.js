import { Router } from 'express';
import { getAllBlogPosts, getBlogPostById } from '../controllers/blogController.js';

const router = Router();

// Public routes (no authentication required)
router.get('/', getAllBlogPosts);
router.get('/:postId', getBlogPostById);

export default router;
