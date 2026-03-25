import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import { FaArrowLeft, FaCheckCircle, FaTimesCircle, FaTrash, FaEye } from 'react-icons/fa';

const StudentManagement = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [reviewModal, setReviewModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await adminAPI.getAllStudents();
            setStudents(response.data.students);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReviewCV = (student) => {
        setSelectedStudent(student);
        setReviewModal(true);
        setRejectionReason('');
    };

    const handleApproveCV = async () => {
        try {
            await adminAPI.reviewStudentCV(selectedStudent.id, {
                status: 'approved',
            });
            alert('CV approved successfully!');
            setReviewModal(false);
            fetchStudents();
        } catch (error) {
            alert('Failed to approve CV');
        }
    };

    const handleRejectCV = async () => {
        if (!rejectionReason.trim()) {
            alert('Please provide a rejection reason');
            return;
        }

        try {
            await adminAPI.reviewStudentCV(selectedStudent.id, {
                status: 'rejected',
                rejectionReason,
            });
            alert('CV rejected successfully');
            setReviewModal(false);
            fetchStudents();
        } catch (error) {
            alert('Failed to reject CV');
        }
    };

    const handleDeleteStudent = async (studentId) => {
        if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            return;
        }

        try {
            await adminAPI.deleteStudent(studentId);
            alert('Student deleted successfully');
            fetchStudents();
        } catch (error) {
            alert('Failed to delete student');
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800',
            approved: 'bg-green-100 text-green-800',
            rejected: 'bg-red-100 text-red-800',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
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
                        <h1 className="text-2xl font-bold text-gray-900">Student Management</h1>
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
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">CV Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {students.map((student) => (
                                    <tr key={student.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {student.fullName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.studentId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.email}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(student.cvStatus)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            <button
                                                onClick={() => window.open(student.cvUrl, '_blank')}
                                                className="text-blue-600 hover:text-blue-900"
                                                title="View CV"
                                            >
                                                <FaEye className="inline w-4 h-4" />
                                            </button>
                                            {student.cvStatus === 'pending' && (
                                                <button
                                                    onClick={() => handleReviewCV(student)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Review CV"
                                                >
                                                    <FaCheckCircle className="inline w-4 h-4" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleDeleteStudent(student.id)}
                                                className="text-red-600 hover:text-red-900"
                                                title="Delete Student"
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

            {/* Review Modal */}
            {reviewModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">Review CV - {selectedStudent.fullName}</h2>

                        <div className="mb-4">
                            <a
                                href={selectedStudent.cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                View CV in new tab
                            </a>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rejection Reason (if rejecting)
                            </label>
                            <textarea
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                                rows="4"
                                placeholder="Provide detailed feedback for the student..."
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={handleApproveCV}
                                className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
                            >
                                Approve CV
                            </button>
                            <button
                                onClick={handleRejectCV}
                                className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                            >
                                Reject CV
                            </button>
                            <button
                                onClick={() => setReviewModal(false)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentManagement;
