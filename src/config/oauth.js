// src/config/oauth.js
/**
 * OAuth Configuration Template
 * 
 * This file provides a template for OAuth configuration.
 * DO NOT add actual credentials here - use environment variables instead.
 * 
 * For local development:
 * 1. Create a .env.local file (which is gitignored)
 * 2. Add your OAuth credentials there
 * 
 * For production:
 * Add these variables to your hosting platform (e.g., Vercel)
 */

// Base URLs for different environments
const REDIRECT_BASE_URL = {
  development: 'http://localhost:3000',
  test: 'http://localhost:3000',
  production: 'https://procalender-frontend.vercel.app' // Update this with your production URL
};

// Get the current environment
const NODE_ENV = import.meta.env.MODE || 'development';

// Base URL based on environment
const baseUrl = REDIRECT_BASE_URL[NODE_ENV] || REDIRECT_BASE_URL.development;

// GitHub OAuth Configuration
export const githubOAuth = {
  // Client ID should come from environment variables
  clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || '',
  
  // Redirect URI for the callback after authentication
  redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI || `${baseUrl}/auth/github/callback`,
  
  // OAuth authorization URL
  getAuthUrl: () => {
    const params = new URLSearchParams({
      client_id: githubOAuth.clientId,
      redirect_uri: githubOAuth.redirectUri,
      scope: 'read:user user:email',
      response_type: 'code'
    });
    
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  },
  
  // Helper function to validate configuration
  isConfigured: () => {
    return !!githubOAuth.clientId;
  }
};

// LinkedIn OAuth Configuration
export const linkedinOAuth = {
  // Client ID should come from environment variables
  clientId: import.meta.env.VITE_LINKEDIN_CLIENT_ID || '',
  
  // Redirect URI for the callback after authentication
  redirectUri: import.meta.env.VITE_LINKEDIN_REDIRECT_URI || `${baseUrl}/auth/linkedin/callback`,
  
  // OAuth authorization URL
  getAuthUrl: () => {
    const params = new URLSearchParams({
      client_id: linkedinOAuth.clientId,
      redirect_uri: linkedinOAuth.redirectUri,
      scope: 'r_liteprofile r_emailaddress',
      response_type: 'code'
    });
    
    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  },
  
  // Helper function to validate configuration
  isConfigured: () => {
    return !!linkedinOAuth.clientId;
  }
};

// Google OAuth Configuration
export const googleOAuth = {
  // Client ID should come from environment variables
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  
  // Redirect URI for the callback after authentication
  redirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI || `${baseUrl}/auth/google/callback`,
  
  // OAuth authorization URL
  getAuthUrl: () => {
    const params = new URLSearchParams({
      client_id: googleOAuth.clientId,
      redirect_uri: googleOAuth.redirectUri,
      scope: 'https://www.googleapis.com/auth/calendar',
      response_type: 'code',
      access_type: 'offline',
      prompt: 'consent'
    });
    
    return `https://accounts.google.com/o/oauth2/auth?${params.toString()}`;
  },
  
  // Helper function to validate configuration
  isConfigured: () => {
    return !!googleOAuth.clientId;
  }
};

/**
 * Usage example:
 * 
 * import { githubOAuth, linkedinOAuth, googleOAuth } from '../config/oauth';
 * 
 * // Check if OAuth is configured
 * if (!githubOAuth.isConfigured()) {
 *   console.warn('GitHub OAuth is not configured');
 * }
 * 
 * // Get authorization URL
 * const authUrl = githubOAuth.getAuthUrl();
 * 
 * // Redirect to authorization URL
 * window.location.href = authUrl;
 */

export default {
  github: githubOAuth,
  linkedin: linkedinOAuth,
  google: googleOAuth,
  
  // Helper function to check if all OAuth providers are configured
  isAllConfigured: () => {
    return githubOAuth.isConfigured() && linkedinOAuth.isConfigured() && googleOAuth.isConfigured();
  }
};