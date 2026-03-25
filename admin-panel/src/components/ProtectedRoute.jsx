import { Navigate } from 'react-router-dom';
import { getAuthToken, getUserData } from '../services/api';

const ProtectedRoute = ({ children }) => {
    const token = getAuthToken();
    const { role } = getUserData();

    // Check if user is authenticated
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Check if user is admin
    if (role !== 'admin') {
        // Not an admin, redirect to login
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
