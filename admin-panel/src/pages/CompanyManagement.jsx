import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaTrash, FaEye, FaTimes } from 'react-icons/fa';

const CompanyManagement = () => {
    const navigate = useNavigate();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchCompanies();
    }, []);

    const fetchCompanies = async () => {
        try {
            const response = await adminAPI.getAllCompanies();
            setCompanies(response.data.companies);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (company) => {
        setSelectedCompany(company);
        setShowModal(true);
    };

    const handleApprove = async (companyId) => {
        try {
            await adminAPI.approveCompany(companyId);
            alert('Company approved successfully!');
            fetchCompanies();
            setShowModal(false);
        } catch (error) {
            alert('Failed to approve company');
        }
    };

    const handleReject = async (companyId) => {
        try {
            await adminAPI.rejectCompany(companyId);
            alert('Company rejected successfully');
            fetchCompanies();
            setShowModal(false);
        } catch (error) {
            alert('Failed to reject company');
        }
    };

    const handleDelete = async (companyId) => {
        if (!window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
            return;
        }

        try {
            await adminAPI.deleteCompany(companyId);
            alert('Company deleted successfully');
            fetchCompanies();
            setShowModal(false);
        } catch (error) {
            alert('Failed to delete company');
        }
    };

    const getStatusBadge = (isApproved) => {
        return isApproved ? (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Approved
            </span>
        ) : (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Pending
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-900">Company Management</h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Business Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {companies.map((company) => (
                                    <tr key={company.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {company.companyName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {company.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {company.businessType}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(company.isApproved)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => handleViewDetails(company)}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="View Details"
                                            >
                                                <FaEye className="inline w-4 h-4" />
                                            </button>
                                            {!company.isApproved && (
                                                <button
                                                    onClick={() => handleApprove(company.id)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Approve Company"
                                                >
                                                    <FaCheckCircle className="inline w-4 h-4" />
                                                </button>
                                            )}
                                            {company.isApproved && (
                                                <button
                                                    onClick={() => handleReject(company.id)}
                                                    className="text-yellow-600 hover:text-yellow-900"
                                                    title="Revoke Approval"
                                                >
                                                    <FaTimesCircle className="inline w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDelete(company.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete Company"
                                            >
                                                <FaTrash className="inline w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Company Details Modal */}
            {showModal && selectedCompany && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-gray-900">Company Details</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                    <p className="text-gray-900">{selectedCompany.companyName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <p className="text-gray-900">{selectedCompany.email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                                    <p className="text-gray-900">{selectedCompany.businessType}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Employer Post</label>
                                    <p className="text-gray-900">{selectedCompany.employerPost || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Details</label>
                                    <p className="text-gray-900">{selectedCompany.contactDetails || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <p>{getStatusBadge(selectedCompany.isApproved)}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <p className="text-gray-900">{selectedCompany.address || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Introduction</label>
                                <p className="text-gray-900 whitespace-pre-wrap">{selectedCompany.introduction || 'N/A'}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                                <p className="text-gray-900">{new Date(selectedCompany.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 flex gap-3 border-t">
                            {!selectedCompany.isApproved ? (
                                <button
                                    onClick={() => handleApprove(selectedCompany.id)}
                                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                >
                                    Approve Company
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleReject(selectedCompany.id)}
                                    className="flex-1 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition"
                                >
                                    Revoke Approval
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(selectedCompany.id)}
                                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                            >
                                Delete Company
                            </button>
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyManagement;
