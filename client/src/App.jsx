import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './layouts/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// Pages
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminEmployeesPage from './pages/AdminEmployeesPage';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminAuditLogsPage from './pages/AdminAuditLogsPage';

import ReceptionistDashboardPage from './pages/ReceptionistDashboardPage';
import VisitorRegistrationPage from './pages/VisitorRegistrationPage';
import ReceptionistVisitorsPage from './pages/ReceptionistVisitorsPage';

import EmployeeDashboardPage from './pages/EmployeeDashboardPage';
import EmployeeHistoryPage from './pages/EmployeeHistoryPage';

import UnauthorizedPage from './pages/UnauthorizedPage';
import NotFoundPage from './pages/NotFoundPage';

// Root redirect handler
const RootRedirect = () => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role === 'ADMINISTRATOR') {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (role === 'RECEPTIONIST') {
    return <Navigate to="/receptionist/dashboard" replace />;
  } else {
    return <Navigate to="/employee/dashboard" replace />;
  }
};

export const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Root */}
            <Route path="/" element={<RootRedirect />} />

            {/* Public */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Administrator Portal */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMINISTRATOR']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="employees" element={<AdminEmployeesPage />} />
              <Route path="users" element={<AdminUsersPage />} />
              <Route path="reports" element={<AdminReportsPage />} />
              <Route path="audit-logs" element={<AdminAuditLogsPage />} />
            </Route>

            {/* Receptionist Portal */}
            <Route
              path="/receptionist"
              element={
                <ProtectedRoute allowedRoles={['RECEPTIONIST', 'ADMINISTRATOR']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/receptionist/dashboard" replace />} />
              <Route path="dashboard" element={<ReceptionistDashboardPage />} />
              <Route path="register" element={<VisitorRegistrationPage />} />
              <Route path="visitors" element={<ReceptionistVisitorsPage />} />
            </Route>

            {/* Employee Host Portal */}
            <Route
              path="/employee"
              element={
                <ProtectedRoute allowedRoles={['EMPLOYEE', 'ADMINISTRATOR']}>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/employee/dashboard" replace />} />
              <Route path="dashboard" element={<EmployeeDashboardPage />} />
              <Route path="history" element={<EmployeeHistoryPage />} />
            </Route>

            {/* 404 Catch All */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
