import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/Landing';
import ShieldPage from './pages/Shield';
import SpendPage from './pages/Spend';
import SavePage from './pages/Save';
import SignUpModal from './components/SignUpModal';

export default function App() {
  const [lang, setLang] = useState('en');
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Check saved user session
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kavach_user');
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      console.warn('Storage not available', e);
    }
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
              onOpenSignUp={() => setIsSignUpOpen(true)}
              onSignOut={handleSignOut}
            />
          }
        >
          <Route index element={<LandingPage onOpenSignUp={() => setIsSignUpOpen(true)} />} />
          <Route path="shield" element={<ShieldPage />} />
          <Route path="spend" element={<SpendPage />} />
          <Route path="save" element={<SavePage />} />
        </Route>
      </Routes>

      {/* Global Interactive Sign Up Modal */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        onComplete={handleSignUpComplete}
        lang={lang}
      />
    </BrowserRouter>
  );
}
