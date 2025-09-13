import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from '../services/auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const userIsAuthenticated = isAuthenticated();
    const userIsAdmin = isAdmin();

    // If user is not authenticated, redirect to home
    if (!userIsAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // If admin access is required but user is not admin, redirect to home
    if (requireAdmin && !userIsAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;