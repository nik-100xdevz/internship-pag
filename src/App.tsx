import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { RoleSelectionPage } from './pages/RoleSelectionPage';
import { InternshipListingPage } from './pages/InternshipListingPage';
import { InternshipDetailsPage } from './pages/InternshipDetailsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route path="/roles" element={
                <ProtectedRoute>
                  <RoleSelectionPage />
                </ProtectedRoute>
              } />
              <Route path="/internships/:role" element={
                <ProtectedRoute>
                  <InternshipListingPage />
                </ProtectedRoute>
              } />
              <Route path="/internship/:id" element={
                <ProtectedRoute>
                  <InternshipDetailsPage />
                </ProtectedRoute>
              } />
              
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;