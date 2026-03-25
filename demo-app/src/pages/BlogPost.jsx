import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { FaArrowLeft, FaDownload } from 'react-icons/fa';

const BlogPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPost();
    }, [id]);

    const fetchPost = async () => {
        try {
            const response = await publicAPI.getBlogPost(id);
            setPost(response.data.post);
        } catch (error) {
            console.error('Error fetching blog post:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h2>
                    <button
                        onClick={() => navigate('/blog')}
                        className="text-primary hover:underline"
                    >
                        Back to Blog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => navigate('/blog')}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary"
                    >
                        <FaArrowLeft /> Back to Blog
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <article className="bg-white rounded-lg shadow-lg p-8">
                    {/* Featured Image */}
                    {post.imageUrls && post.imageUrls.length > 0 && (
                        <img
                            src={post.imageUrls[0]}
                            alt={post.title}
                            className="w-full h-96 object-cover rounded-lg mb-8"
                        />
                    )}

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>

                    {/* Meta */}
                    <div className="flex items-center gap-4 text-gray-600 mb-8 pb-8 border-b">
                        <div>
                            <p className="font-medium">By {post.admin.name}</p>
                            <p className="text-sm">{post.admin.position}</p>
                        </div>
                        <span>•</span>
                        <p>{new Date(post.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</p>
                    </div>

                    {/* Content with Rich Text */}
                    <div
                        className="prose prose-lg max-w-none mb-8"
                        dangerouslySetInnerHTML={{ __html: post.body }}
                        style={{
                            lineHeight: '1.8',
                        }}
                    />

                    {/* Attachments */}
                    {post.attachmentUrls && post.attachmentUrls.length > 0 && (
                        <div className="mt-8 pt-8 border-t">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Attachments</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {post.attachmentUrls.map((url, index) => (
                                    <a
                                        key={index}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <FaDownload className="text-primary" />
                                        <span className="text-gray-700">Attachment {index + 1}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </article>
            </div>

            <style jsx>{`
        .prose img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        .prose p {
          margin-bottom: 1rem;
        }
        .prose h1, .prose h2, .prose h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-weight: bold;
        }
        .prose ul, .prose ol {
          margin-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .prose blockquote {
          border-left: 4px solid #A67C52;
          padding-left: 1rem;
          font-style: italic;
          color: #4B5563;
        }
      `}</style>
        </div>
    );
};

export default BlogPost;
