import { db } from '../config/database.js';
import { blogPosts, admins } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { uploadToGoogleDrive } from '../services/googleDrive.js';

/**
 * Create a new blog post
 * POST /admin/blog-posts
 * Files: images[] (optional), attachments[] (optional)
 */
export const createBlogPost = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const { title, body } = req.body;

        if (!title || !body) {
            res.status(400).json({ error: 'Title and body are required' });
            return;
        }

        const files = req.files;
        const imageUrls = [];
        const attachmentUrls = [];

        // Upload images if provided
        if (files && files.images && files.images.length > 0) {
            for (const imageFile of files.images) {
                const imageUrl = await uploadToGoogleDrive({
                    fileName: `blog_image_${Date.now()}_${imageFile.originalname}`,
                    mimeType: imageFile.mimetype,
                    buffer: imageFile.buffer,
                    folderType: 'blog_image',
                });
                imageUrls.push(imageUrl);
            }
        }

        // Upload attachments if provided
        if (files && files.attachments && files.attachments.length > 0) {
            for (const attachmentFile of files.attachments) {
                const attachmentUrl = await uploadToGoogleDrive({
                    fileName: `blog_attachment_${Date.now()}_${attachmentFile.originalname}`,
                    mimeType: attachmentFile.mimetype,
                    buffer: attachmentFile.buffer,
                    folderType: 'blog_attachment',
                });
                attachmentUrls.push(attachmentUrl);
            }
        }

        // Create blog post
        const [newPost] = await db
            .insert(blogPosts)
            .values({
                adminId: req.user.id,
                title,
                body,
                imageUrls: imageUrls.length > 0 ? imageUrls : null,
                attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : null,
            })
            .returning();

        res.status(201).json({
            message: 'Blog post created successfully',
            post: {
                id: newPost.id,
                title: newPost.title,
                body: newPost.body,
                imageUrls: newPost.imageUrls,
                attachmentUrls: newPost.attachmentUrls,
                createdAt: newPost.createdAt,
            },
        });
    } catch (error) {
        console.error('Error in createBlogPost:', error);
        res.status(500).json({ error: error.message || 'Failed to create blog post' });
    }
};

/**
 * Get all blog posts
 * GET /admin/blog-posts
 */
export const getAllBlogPosts = async (req, res) => {
    try {
        const posts = await db
            .select({
                id: blogPosts.id,
                title: blogPosts.title,
                body: blogPosts.body,
                imageUrls: blogPosts.imageUrls,
                attachmentUrls: blogPosts.attachmentUrls,
                createdAt: blogPosts.createdAt,
                updatedAt: blogPosts.updatedAt,
                admin: {
                    id: admins.id,
                    name: admins.name,
                    position: admins.position,
                },
            })
            .from(blogPosts)
            .innerJoin(admins, eq(blogPosts.adminId, admins.id))
            .orderBy(blogPosts.createdAt);

        res.json({ posts });
    } catch (error) {
        console.error('Error in getAllBlogPosts:', error);
        res.status(500).json({ error: error.message || 'Failed to get blog posts' });
    }
};

/**
 * Get a single blog post by ID
 * GET /admin/blog-posts/:postId
 */
export const getBlogPostById = async (req, res) => {
    try {
        const postId = parseInt(req.params.postId);

        const [post] = await db
            .select({
                id: blogPosts.id,
                title: blogPosts.title,
                body: blogPosts.body,
                imageUrls: blogPosts.imageUrls,
                attachmentUrls: blogPosts.attachmentUrls,
                createdAt: blogPosts.createdAt,
                updatedAt: blogPosts.updatedAt,
                admin: {
                    id: admins.id,
                    name: admins.name,
                    position: admins.position,
                },
            })
            .from(blogPosts)
            .innerJoin(admins, eq(blogPosts.adminId, admins.id))
            .where(eq(blogPosts.id, postId))
            .limit(1);

        if (!post) {
            res.status(404).json({ error: 'Blog post not found' });
            return;
        }

        res.json({ post });
    } catch (error) {
        console.error('Error in getBlogPostById:', error);
        res.status(500).json({ error: error.message || 'Failed to get blog post' });
    }
};

/**
 * Update a blog post
 * PUT /admin/blog-posts/:postId
 * Files: images[] (optional), attachments[] (optional)
 */
export const updateBlogPost = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const postId = parseInt(req.params.postId);
        const { title, body } = req.body;

        // Check if post exists and belongs to admin
        const [existingPost] = await db
            .select()
            .from(blogPosts)
            .where(eq(blogPosts.id, postId))
            .limit(1);

        if (!existingPost) {
            res.status(404).json({ error: 'Blog post not found' });
            return;
        }

        if (existingPost.adminId !== req.user.id) {
            res.status(403).json({ error: 'You can only update your own blog posts' });
            return;
        }

        const updateData = {
            updatedAt: new Date(),
        };

        if (title) updateData.title = title;
        if (body) updateData.body = body;

        const files = req.files;

        // Upload new images if provided
        if (files && files.images && files.images.length > 0) {
            const imageUrls = [];
            for (const imageFile of files.images) {
                const imageUrl = await uploadToGoogleDrive({
                    fileName: `blog_image_${Date.now()}_${imageFile.originalname}`,
                    mimeType: imageFile.mimetype,
                    buffer: imageFile.buffer,
                    folderType: 'blog_image',
                });
                imageUrls.push(imageUrl);
            }
            // Append to existing images or replace
            updateData.imageUrls = [...(existingPost.imageUrls || []), ...imageUrls];
        }

        // Upload new attachments if provided
        if (files && files.attachments && files.attachments.length > 0) {
            const attachmentUrls = [];
            for (const attachmentFile of files.attachments) {
                const attachmentUrl = await uploadToGoogleDrive({
                    fileName: `blog_attachment_${Date.now()}_${attachmentFile.originalname}`,
                    mimeType: attachmentFile.mimetype,
                    buffer: attachmentFile.buffer,
                    folderType: 'blog_attachment',
                });
                attachmentUrls.push(attachmentUrl);
            }
            // Append to existing attachments or replace
            updateData.attachmentUrls = [...(existingPost.attachmentUrls || []), ...attachmentUrls];
        }

        const [updatedPost] = await db
            .update(blogPosts)
            .set(updateData)
            .where(eq(blogPosts.id, postId))
            .returning();

        res.json({
            message: 'Blog post updated successfully',
            post: updatedPost,
        });
    } catch (error) {
        console.error('Error in updateBlogPost:', error);
        res.status(500).json({ error: error.message || 'Failed to update blog post' });
    }
};

/**
 * Delete a blog post
 * DELETE /admin/blog-posts/:postId
 */
export const deleteBlogPost = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const postId = parseInt(req.params.postId);

        // Check if post exists and belongs to admin
        const [existingPost] = await db
            .select()
            .from(blogPosts)
            .where(eq(blogPosts.id, postId))
            .limit(1);

        if (!existingPost) {
            res.status(404).json({ error: 'Blog post not found' });
            return;
        }

        if (existingPost.adminId !== req.user.id) {
            res.status(403).json({ error: 'You can only delete your own blog posts' });
            return;
        }

        await db.delete(blogPosts).where(eq(blogPosts.id, postId));

        res.json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error in deleteBlogPost:', error);
        res.status(500).json({ error: error.message || 'Failed to delete blog post' });
    }
};

/**
 * Upload inline image for Quill editor
 * POST /admin/blog-posts/upload-inline-image
 * Files: image (required)
 */
export const uploadInlineImage = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const files = req.files;

        if (!files || !files.image || files.image.length === 0) {
            res.status(400).json({ error: 'Image file is required' });
            return;
        }

        const imageFile = files.image[0];

        // Upload image to Google Drive
        const imageUrl = await uploadToGoogleDrive({
            fileName: `blog_inline_${Date.now()}_${imageFile.originalname}`,
            mimeType: imageFile.mimetype,
            buffer: imageFile.buffer,
            folderType: 'blog_image',
        });

        res.json({ url: imageUrl });
    } catch (error) {
        console.error('Error in uploadInlineImage:', error);
        res.status(500).json({ error: error.message || 'Failed to upload image' });
    }
};
