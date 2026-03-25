import { Navigate } from 'react-router-dom';
import { getAuthToken, getUserData } from '../services/api';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const token = getAuthToken();
    const { role } = getUserData();

    // Check if user is authenticated
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Check if user has the required role
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        // Redirect based on role
        if (role === 'student') {
            return <Navigate to="/profile" replace />;
        } else if (role === 'company') {
            return <Navigate to="/company-dashboard" replace />;
        } else if (role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
