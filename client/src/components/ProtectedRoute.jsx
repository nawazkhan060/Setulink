import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If citizen lands on admin route or vice versa, redirect to appropriate home
    if (user.role === 'citizen') return <Navigate to="/citizen" replace />;
    if (user.role === 'clerk' || user.role === 'officer') return <Navigate to="/staff/queue" replace />;
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
  }

  return children;
};
