import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import RichTextEditor from '../components/RichTextEditor';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const BlogManagement = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        body: '',
    });
    const [attachments, setAttachments] = useState([]);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await adminAPI.getAllBlogPosts();
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingPost(null);
        setFormData({ title: '', body: '' });
        setAttachments([]);
        setShowCreateModal(true);
    };

    const handleEdit = (post) => {
        setEditingPost(post);
        setFormData({ title: post.title, body: post.body });
        setAttachments([]);
        setShowCreateModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('body', formData.body);

        // Add attachments
        attachments.forEach((file) => {
            data.append('attachments', file);
        });

        try {
            if (editingPost) {
                await adminAPI.updateBlogPost(editingPost.id, data);
                alert('Blog post updated successfully!');
            } else {
                await adminAPI.createBlogPost(data);
                alert('Blog post created successfully!');
            }
            setShowCreateModal(false);
            fetchPosts();
        } catch (error) {
            alert('Failed to save blog post');
            console.error(error);
        }
    };

    const handleDelete = async (postId) => {
        if (!window.confirm('Are you sure you want to delete this blog post?')) {
            return;
        }

        try {
            await adminAPI.deleteBlogPost(postId);
            alert('Blog post deleted successfully');
            fetchPosts();
        } catch (error) {
            alert('Failed to delete blog post');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <FaArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
                        </div>
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#8B5C2B]"
                        >
                            <FaPlus /> Create Post
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="bg-white rounded-lg shadow p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    By {post.admin.name} • {new Date(post.createdAt).toLocaleDateString()}
                                </p>
                                <div
                                    className="text-sm text-gray-700 mb-4 line-clamp-3"
                                    dangerouslySetInnerHTML={{ __html: post.body }}
                                />
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 text-sm"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 text-sm"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-lg max-w-4xl w-full p-6 my-8">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingPost ? 'Edit Blog Post' : 'Create Blog Post'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Enter blog post title..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Content (Rich Text)
                                </label>
                                <RichTextEditor
                                    value={formData.body}
                                    onChange={(value) => setFormData({ ...formData, body: value })}
                                    placeholder="Write your blog post content here... You can insert images directly in the text!"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    💡 Tip: Click the image icon in the toolbar to insert images directly into your content
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Attachments (Optional - PDFs, DOCX, etc.)
                                </label>
                                <input
                                    type="file"
                                    accept=".pdf,.docx,.doc,image/*"
                                    multiple
                                    onChange={(e) => setAttachments(Array.from(e.target.files))}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Upload downloadable files (max 5)
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex-1 bg-primary text-white py-3 rounded-lg hover:bg-[#8B5C2B]"
                                >
                                    {editingPost ? 'Update Post' : 'Create Post'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogManagement;
