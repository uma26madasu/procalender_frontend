// src/api/index.js

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

// Function to handle LinkedIn OAuth code exchange
export const connectLinkedIn = async (code, userId) => {
  try {
    // In a real implementation, you would:
    // 1. Exchange the code for an access token via your backend
    // 2. Store the token in your database associated with userId
    // 3. Optionally fetch user profile data from LinkedIn
    
    console.log('Connecting LinkedIn with code:', code, 'for user:', userId);
    
    // For development/testing, just return success
    // Replace with actual API call in production
    return {
      success: true,
      message: 'LinkedIn account connected successfully'
    };
  } catch (error) {
    console.error('Error connecting LinkedIn account:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to connect LinkedIn account' 
    };
  }
};

// Function to disconnect LinkedIn account
export const disconnectLinkedIn = async (userId) => {
  try {
    // In a real implementation, you would:
    // 1. Remove the stored LinkedIn tokens from your database
    // 2. Possibly revoke access on LinkedIn's side
    
    console.log('Disconnecting LinkedIn for user:', userId);
    
    // For development/testing, just return success
    return {
      success: true,
      message: 'LinkedIn account disconnected successfully'
    };
  } catch (error) {
    console.error('Error disconnecting LinkedIn account:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to disconnect LinkedIn account' 
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

// Function to handle GitHub OAuth code exchange
export const connectGitHub = async (code, userId) => {
  try {
    // In a real implementation, you would:
    // 1. Exchange the code for an access token via your backend
    // 2. Store the token in your database associated with userId
    // 3. Optionally fetch user profile data from GitHub
    
    console.log('Connecting GitHub with code:', code, 'for user:', userId);
    
    // For development/testing, just return success
    // Replace with actual API call in production
    return {
      success: true,
      message: 'GitHub account connected successfully'
    };
  } catch (error) {
    console.error('Error connecting GitHub account:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to connect GitHub account' 
    };
  }
};

// Function to disconnect GitHub account
export const disconnectGitHub = async (userId) => {
  try {
    // In a real implementation, you would:
    // 1. Remove the stored GitHub tokens from your database
    // 2. Possibly revoke access on GitHub's side
    
    console.log('Disconnecting GitHub for user:', userId);
    
    // For development/testing, just return success
    return {
      success: true,
      message: 'GitHub account disconnected successfully'
    };
  } catch (error) {
    console.error('Error disconnecting GitHub account:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to disconnect GitHub account' 
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

// Function to handle Google OAuth code exchange
export const connectGoogle = async (code, userId) => {
  try {
    // In a real implementation, you would:
    // 1. Exchange the code for an access token via your backend
    // 2. Store the token in your database associated with userId
    // 3. Set up calendar integration
    
    console.log('Connecting Google with code:', code, 'for user:', userId);
    
    // For development/testing, just return success
    // Replace with actual API call in production
    return {
      success: true,
      message: 'Google account connected successfully'
    };
  } catch (error) {
    console.error('Error connecting Google account:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to connect Google account' 
    };
  }
};

// Function to disconnect Google account
export const disconnectGoogle = async (userId) => {
  try {
    // In a real implementation, you would:
    // 1. Remove the stored Google tokens from your database
    // 2. Possibly revoke access on Google's side
    
    console.log('Disconnecting Google for user:', userId);
    
    // For development/testing, just return success
    return {
      success: true,
      message: 'Google account disconnected successfully'
    };
  } catch (error) {
    console.error('Error disconnecting Google account:', error);
    return { 
      success: false, 
      message: error.message || 'Failed to disconnect Google account' 
    };
  }
};

// Export all functions individually
export {
  // The individual functions are already exported above with 'export const'
  // This is just for clarity if someone wants to import multiple functions
};

// You could also export a default object if preferred
// export default {
//   getLinkedInAuthUrl,
//   connectLinkedIn,
//   disconnectLinkedIn,
//   getGitHubAuthUrl,
//   connectGitHub,
//   disconnectGitHub,
//   getGoogleAuthUrl,
//   connectGoogle,
//   disconnectGoogle
// };