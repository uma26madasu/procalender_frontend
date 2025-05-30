// src/config/oauth.js - FIXED WITH CORRECT ENDPOINT
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://procalender-backend.onrender.com';

export const oauth = {
  // Use the correct backend endpoint
  loginWithGoogle() {
    window.location.href = `${API_BASE_URL}/api/auth/google/url`;
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