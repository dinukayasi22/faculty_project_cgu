import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, getUserData } from '../services/api';
import { FaUsers, FaBuilding, FaFileAlt, FaBlog, FaCheckCircle, FaClock } from 'react-icons/fa';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = getUserData();
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalCompanies: 0,
        pendingCVs: 0,
        pendingCompanies: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [studentsRes, companiesRes] = await Promise.all([
                adminAPI.getAllStudents(),
                adminAPI.getAllCompanies(),
            ]);

            const students = studentsRes.data.students;
            const companies = companiesRes.data.companies;

            setStats({
                totalStudents: students.length,
                totalCompanies: companies.length,
                pendingCVs: students.filter((s) => s.cvStatus === 'pending').length,
                pendingCompanies: companies.filter((c) => !c.isApproved).length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Students',
            value: stats.totalStudents,
            icon: FaUsers,
            color: 'bg-blue-500',
            link: '/students',
        },
        {
            title: 'Total Companies',
            value: stats.totalCompanies,
            icon: FaBuilding,
            color: 'bg-green-500',
            link: '/companies',
        },
        {
            title: 'Pending CVs',
            value: stats.pendingCVs,
            icon: FaClock,
            color: 'bg-yellow-500',
            link: '/admin/students',
        },
        {
            title: 'Pending Companies',
            value: stats.pendingCompanies,
            icon: FaClock,
            color: 'bg-orange-500',
            link: '/admin/companies',
        },
    ];

    const quickActions = [
        {
            title: 'Manage Students',
            description: 'Review and approve student CVs',
            icon: FaUsers,
            link: '/admin/students',
            color: 'bg-blue-500',
        },
        {
            title: 'Manage Companies',
            description: 'Approve or reject company registrations',
            icon: FaBuilding,
            link: '/admin/companies',
            color: 'bg-green-500',
        },
        {
            title: 'Manage Blog Posts',
            description: 'Create and manage blog content',
            icon: FaBlog,
            link: '/blog',
            color: 'bg-purple-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(stat.link)}
                            className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {loading ? '...' : stat.value}
                                    </p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-full`}>
                                    <stat.icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {quickActions.map((action, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(action.link)}
                                className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
                            >
                                <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center mb-4`}>
                                    <action.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.title}</h3>
                                <p className="text-sm text-gray-600">{action.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
