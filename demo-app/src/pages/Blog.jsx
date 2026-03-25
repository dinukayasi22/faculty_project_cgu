import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';

const Blog = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const response = await publicAPI.getAllBlogPosts();
            setPosts(response.data.posts);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const stripHtml = (html) => {
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-primary text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-center">Blog & News</h1>
                    <p className="text-center mt-4 text-lg">
                        Stay updated with the latest news and announcements
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No blog posts yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => navigate(`/blog/${post.id}`)}
                                className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                            >
                                {post.imageUrls && post.imageUrls.length > 0 && (
                                    <img
                                        src={post.imageUrls[0]}
                                        alt={post.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-sm text-gray-600 mb-3">
                                        By {post.admin.name} • {new Date(post.createdAt).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-700 line-clamp-3">
                                        {stripHtml(post.body)}
                                    </p>
                                    <button className="mt-4 text-primary hover:underline font-medium">
                                        Read More →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Blog;
