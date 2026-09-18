import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/Landing';
import AuthPage from './pages/Auth';
import DashboardPage from './pages/Dashboard';
import ShieldPage from './pages/Shield';
import SpendPage from './pages/Spend';
import SavePage from './pages/Save';
import GoalsPage from './pages/Goals';
import QuizPage from './pages/Quiz';
import ChatPage from './pages/Chat';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-stone-900"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function App() {
  const { user, logout } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Layout user={user} onSignOut={logout} />}
        >
          <Route index element={<LandingPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="shield"
            element={
              <ProtectedRoute>
                <ShieldPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="spend"
            element={
              <ProtectedRoute>
                <SpendPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="save"
            element={
              <ProtectedRoute>
                <SavePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="goals"
            element={
              <ProtectedRoute>
                <GoalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
