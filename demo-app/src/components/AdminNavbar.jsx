import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { removeAuthToken } from '../services/api';
import { FaHome, FaUsers, FaBuilding, FaBlog, FaSignOutAlt } from 'react-icons/fa';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        removeAuthToken();
        navigate('/admin/login');
    };

    const navLinks = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: FaHome },
        { path: '/admin/students', label: 'Students', icon: FaUsers },
        { path: '/admin/companies', label: 'Companies', icon: FaBuilding },
        { path: '/admin/blog', label: 'Blog', icon: FaBlog },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-primary shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link to="/admin/dashboard" className="text-white text-xl font-bold">
                            Admin Panel
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                                        ? 'bg-white text-primary'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                            <FaSignOutAlt className="w-4 h-4" />
                            Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-md text-sm font-medium"
                        >
                            <FaSignOutAlt className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div className="md:hidden pb-3">
                    <div className="flex flex-col space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${isActive(link.path)
                                        ? 'bg-white text-primary'
                                        : 'text-white hover:bg-white/10'
                                    }`}
                            >
                                <link.icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
