// src/config/oauth.js - MINIMAL FIX
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://procalender-backend.onrender.com';

export const oauth = {
  // Instead of frontend OAuth, just redirect to backend
  loginWithGoogle() {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  },

  // Handle when backend redirects back with token
  async handleCallback(urlParams) {
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (error) {
      return { success: false, error: decodeURIComponent(error) };
    }
    
    if (token) {
      localStorage.setItem('authToken', token);
      return { success: true, token, returnUrl: '/dashboard' };
    }
    
    return { success: false, error: 'No token received' };
  },

  getToken() {
    return localStorage.getItem('authToken');
  },

  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  logout() {
    localStorage.removeItem('authToken');
    window.location.href = '/';
  }
};