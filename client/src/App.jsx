import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { CitizenDashboard } from './pages/CitizenDashboard';
import { CitizenApplications } from './pages/CitizenApplications';
import { CitizenConsent } from './pages/CitizenConsent';
import { StaffTaskQueue } from './pages/StaffTaskQueue';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminConflicts } from './pages/AdminConflicts';
import { AdminWorkflows } from './pages/AdminWorkflows';
import { AdminConnectors } from './pages/AdminConnectors';
import { AdminAuditLogs } from './pages/AdminAuditLogs';
import { AdminExceptions } from './pages/AdminExceptions';

const AppLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Routes>
          {/* 3D Interactive Landing Page & Architecture Showcase */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/tour" element={<LandingPage />} />

          {/* Login Gate with Evaluator Notice */}
          <Route path="/login" element={<Login />} />

          {/* Citizen Routes */}
          <Route
            path="/citizen"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'clerk', 'officer', 'admin']}>
                <AppLayout>
                  <CitizenDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/applications"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'clerk', 'officer', 'admin']}>
                <AppLayout>
                  <CitizenApplications />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/consent"
            element={
              <ProtectedRoute allowedRoles={['citizen', 'clerk', 'officer', 'admin']}>
                <AppLayout>
                  <CitizenConsent />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Staff Task Queue Routes */}
          <Route
            path="/staff/queue"
            element={
              <ProtectedRoute allowedRoles={['clerk', 'officer', 'admin']}>
                <AppLayout>
                  <StaffTaskQueue />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout>
                  <AdminDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/conflicts"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout>
                  <AdminConflicts />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/workflows"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout>
                  <AdminWorkflows />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/connectors"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout>
                  <AdminConnectors />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/audit-logs"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout>
                  <AdminAuditLogs />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/exceptions"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AppLayout>
                  <AdminExceptions />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  );
}
