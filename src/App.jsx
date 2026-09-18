import React, { useState, useEffect } from 'react';
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

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function App() {
  const [lang, setLang] = useState('en');
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('kavach_user');
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {}
  }, []);

  const handleSignUpComplete = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem('kavach_user', JSON.stringify(userData));
    } catch (e) {}
  };

  const handleSignOut = () => {
    setUser(null);
    try {
      localStorage.removeItem('kavach_user');
    } catch (e) {}
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              lang={lang}
              setLang={setLang}
              user={user}
              onSignOut={handleSignOut}
              onLogin={handleSignUpComplete}
            />
          }
        >
          <Route index element={<LandingPage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute user={user}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="shield"
            element={
              <ProtectedRoute user={user}>
                <ShieldPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="spend"
            element={
              <ProtectedRoute user={user}>
                <SpendPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="save"
            element={
              <ProtectedRoute user={user}>
                <SavePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="goals"
            element={
              <ProtectedRoute user={user}>
                <GoalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="quiz"
            element={
              <ProtectedRoute user={user}>
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
