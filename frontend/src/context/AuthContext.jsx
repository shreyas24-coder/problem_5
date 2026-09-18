import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedToken = localStorage.getItem('kavach_token');
        const savedUser = localStorage.getItem('kavach_user');
        if (savedToken && savedUser) {
          setUser(JSON.parse(savedUser));
          // Verify with backend
          try {
            const freshProfile = await authApi.getMe();
            setUser(freshProfile);
            localStorage.setItem('kavach_user', JSON.stringify(freshProfile));
          } catch (err) {
            console.warn('Session check failed, using cached profile:', err);
          }
        }
      } catch (e) {
        console.error('Error reading auth state:', e);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for auth expiration events
    const handleAuthExpired = () => {
      setUser(null);
    };
    window.addEventListener('kavach_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('kavach_auth_expired', handleAuthExpired);
  }, []);

  const login = async (email, password) => {
    const res = await authApi.login(email, password);
    setUser(res.user);
    return res;
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    setUser(res.user);
    return res;
  };

  // One-click demo login for presentations
  const loginDemo = async () => {
    try {
      const res = await authApi.login('demo@technofora.com', 'Demo@12345');
      setUser(res.user);
      return res;
    } catch (err) {
      console.error('Demo login error:', err);
      // If demo user wasn't registered yet, try registering it
      try {
        const regRes = await authApi.register({
          email: 'demo@technofora.com',
          password: 'Demo@12345',
          full_name: 'Alex Rivera',
          expected_monthly_savings: 15000,
        });
        setUser(regRes.user);
        return regRes;
      } catch (regErr) {
        throw new Error(regErr.message || 'Failed to authenticate demo user');
      }
    }
  };

  const logout = () => {
    authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
