// src/api/index.js
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://procalender-backend.onrender.com';

export const apiService = {
  // Health check
  checkBackend: async () => {
    const response = await fetch(`${API_BASE}/`);
    return await response.json();
  },

  // Scheduling endpoints
  createWindow: async (windowData) => {
    const response = await fetch(`${API_BASE}/api/create-window`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(windowData)
    });
    return await response.json();
  },

  createLink: async (linkData) => {
    const response = await fetch(`${API_BASE}/api/create-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(linkData)
    });
    return await response.json();
  },

  getAvailableTimes: async (linkId) => {
    const response = await fetch(`${API_BASE}/api/available-times/${linkId}`);
    return await response.json();
  },

  scheduleMeeting: async (linkId, formData) => {
    const response = await fetch(`${API_BASE}/api/schedule/${linkId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    return await response.json();
  }
};