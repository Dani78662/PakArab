import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import RamzinDashboard from './pages/RamzinDashboard';
import EditorDashboard from './pages/EditorDashboard';
import Service from './pages/Service';
import BillDetails from './pages/BillDetails';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/admin-dashboard" 
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/ramzin-dashboard" 
        element={
          <ProtectedRoute requiredRole="ramzin">
            <RamzinDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/editor-dashboard" 
        element={
          <ProtectedRoute requiredRole="editor">
            <EditorDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/service" 
        element={
          <ProtectedRoute requiredRole="editor2">
            <Service />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/bill/:id" 
        element={
          <ProtectedRoute requiredRole="ramzin">
            <BillDetails />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
