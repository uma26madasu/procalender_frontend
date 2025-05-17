// src/api/index.js - Add default export
import oauthConfig from '../config/oauth';

// LinkedIn OAuth related functions
export const getLinkedInAuthUrl = async () => {
  // Existing implementation
};

// Function to handle LinkedIn OAuth code exchange
export const connectLinkedIn = async (code, userId) => {
  // Existing implementation 
};

// Function to disconnect LinkedIn account
export const disconnectLinkedIn = async (userId) => {
  // Existing implementation
};

// GitHub OAuth related functions
export const getGitHubAuthUrl = async () => {
  // Existing implementation
};

// Function to handle GitHub OAuth code exchange
export const connectGitHub = async (code, userId) => {
  // Existing implementation
};

// Function to disconnect GitHub account
export const disconnectGitHub = async (userId) => {
  // Existing implementation
};

// Google Calendar OAuth function
export const getGoogleAuthUrl = async () => {
  // Existing implementation
};

// Function to handle Google OAuth code exchange
export const connectGoogle = async (code, userId) => {
  // Existing implementation
};

// Function to disconnect Google account
export const disconnectGoogle = async (userId) => {
  // Existing implementation
};

// Create an object with all the functions
const apiService = {
  getLinkedInAuthUrl,
  connectLinkedIn,
  disconnectLinkedIn,
  getGitHubAuthUrl,
  connectGitHub,
  disconnectGitHub,
  getGoogleAuthUrl,
  connectGoogle,
  disconnectGoogle
};

// Export individual functions as named exports
export {
  // These are already exported above with 'export const'
};

// Export the API service object as default export
export default apiService;