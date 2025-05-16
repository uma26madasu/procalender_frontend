// Updated OAuth-related functions in src/api/index.js
// These functions would replace the existing ones in your file

import oauthConfig from '../config/oauth';

// LinkedIn OAuth related functions
export const getLinkedInAuthUrl = async () => {
  try {
    // Check if LinkedIn OAuth is configured
    if (!oauthConfig.linkedin.isConfigured()) {
      console.warn('LinkedIn OAuth is not configured. Using demo URL.');
      // Return a demo URL for development without credentials
      return {
        success: true,
        url: `https://www.linkedin.com/oauth/v2/authorization?client_id=DEMO_MODE&redirect_uri=${encodeURIComponent(oauthConfig.linkedin.redirectUri)}&response_type=code&scope=r_liteprofile%20r_emailaddress`
      };
    }
    
    // Generate the authorization URL
    const authUrl = oauthConfig.linkedin.getAuthUrl();
    
    console.log('LinkedIn OAuth URL generated successfully');
    
    return {
      success: true,
      url: authUrl
    };
  } catch (error) {
    console.error('Error getting LinkedIn auth URL:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to get LinkedIn auth URL' 
    };
  }
};

// GitHub OAuth related functions
export const getGitHubAuthUrl = async () => {
  try {
    // Check if GitHub OAuth is configured
    if (!oauthConfig.github.isConfigured()) {
      console.warn('GitHub OAuth is not configured. Using demo URL.');
      // Return a demo URL for development without credentials
      return {
        success: true,
        url: `https://github.com/login/oauth/authorize?client_id=DEMO_MODE&redirect_uri=${encodeURIComponent(oauthConfig.github.redirectUri)}&scope=read:user%20user:email`
      };
    }
    
    // Generate the authorization URL
    const authUrl = oauthConfig.github.getAuthUrl();
    
    console.log('GitHub OAuth URL generated successfully');
    
    return {
      success: true,
      url: authUrl
    };
  } catch (error) {
    console.error('Error getting GitHub auth URL:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to get GitHub auth URL' 
    };
  }
};

// Google Calendar OAuth function
export const getGoogleAuthUrl = async () => {
  try {
    // Check if Google OAuth is configured
    if (!oauthConfig.google.isConfigured()) {
      console.warn('Google OAuth is not configured. Using demo URL.');
      // Return a demo URL for development without credentials
      return {
        success: true,
        url: `https://accounts.google.com/o/oauth2/auth?client_id=DEMO_MODE&redirect_uri=${encodeURIComponent(oauthConfig.google.redirectUri)}&scope=https://www.googleapis.com/auth/calendar&response_type=code`
      };
    }
    
    // Generate the authorization URL
    const authUrl = oauthConfig.google.getAuthUrl();
    
    console.log('Google OAuth URL generated successfully');
    
    return {
      success: true,
      url: authUrl
    };
  } catch (error) {
    console.error('Error getting Google auth URL:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to get Google auth URL' 
    };
  }
};