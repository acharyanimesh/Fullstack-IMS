import React from 'react';
import { Navigate } from 'react-router-dom';
import ApiService from '../service/ApiService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const isAuthenticated = ApiService.isAuthenticated();
  const isAdmin = ApiService.isAdmin();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If admin access is required but user is not admin, redirect to dashboard
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated (and admin if required), render the protected component
  return children;
};

export default ProtectedRoute;
