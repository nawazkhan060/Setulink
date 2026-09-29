import React from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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

// Icons for Mobile Bottom Nav
import { LayoutDashboard, FileText, ShieldCheck, CheckSquare, Layers, AlertTriangle } from 'lucide-react';

const AppLayout = ({ children }) => {
  const { user } = useAuth();
  const role = user?.role || 'citizen';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-3 sm:p-6 lg:p-8 max-w-full overflow-hidden pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden py-2 px-3 shadow-lg flex items-center justify-around text-[10px] font-semibold text-slate-500">
        {role === 'citizen' && (
          <>
            <NavLink
              to="/citizen"
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition ${isActive ? 'text-gov-600 font-bold' : 'hover:text-slate-800'}`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Profile</span>
            </NavLink>

            <NavLink
              to="/citizen/applications"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition ${isActive ? 'text-gov-600 font-bold' : 'hover:text-slate-800'}`
              }
            >
              <FileText className="w-4 h-4" />
              <span>Requests</span>
            </NavLink>

            <NavLink
              to="/citizen/consent"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition ${isActive ? 'text-gov-600 font-bold' : 'hover:text-slate-800'}`
              }
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Consent</span>
            </NavLink>

            <NavLink
              to="/"
              className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-800"
            >
              <Layers className="w-4 h-4 text-amber-500" />
              <span>3D Tour</span>
            </NavLink>
          </>
        )}

        {(role === 'clerk' || role === 'officer') && (
          <>
            <NavLink
              to="/staff/queue"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition ${isActive ? 'text-gov-600 font-bold' : 'hover:text-slate-800'}`
              }
            >
              <CheckSquare className="w-4 h-4" />
              <span>Queue</span>
            </NavLink>

            <NavLink
              to="/citizen"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition ${isActive ? 'text-gov-600 font-bold' : 'hover:text-slate-800'}`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Records</span>
            </NavLink>

            <NavLink
              to="/"
              className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-800"
            >
              <Layers className="w-4 h-4 text-amber-500" />
              <span>3D Tour</span>
            </NavLink>
          </>
        )}

        {role === 'admin' && (
          <>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition ${isActive ? 'text-gov-600 font-bold' : 'hover:text-slate-800'}`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Metrics</span>
            </NavLink>

            <NavLink
              to="/admin/conflicts"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition ${isActive ? 'text-gov-600 font-bold' : 'hover:text-slate-800'}`
              }
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Conflicts</span>
            </NavLink>

            <NavLink
              to="/admin/workflows"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 transition ${isActive ? 'text-gov-600 font-bold' : 'hover:text-slate-800'}`
              }
            >
              <Layers className="w-4 h-4" />
              <span>Workflows</span>
            </NavLink>

            <NavLink
              to="/"
              className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-800"
            >
              <Layers className="w-4 h-4 text-amber-500" />
              <span>3D Tour</span>
            </NavLink>
          </>
        )}
      </nav>
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
