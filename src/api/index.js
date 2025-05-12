const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const apiService = {
  // User and Authentication
  createUser: async (userData) => {
    const response = await fetch(`${API_BASE}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return await response.json();
  },
  
  // Google Calendar OAuth
  getGoogleAuthUrl: async () => {
    const response = await fetch(`${API_BASE}/api/auth/google/url`);
    return await response.json();
  },
  
  connectGoogleCalendar: async (code, userId) => {
    const response = await fetch(`${API_BASE}/api/auth/google/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, userId })
    });
    return await response.json();
  },
  
  disconnectGoogleCalendar: async (userId) => {
    const response = await fetch(`${API_BASE}/api/auth/google/revoke`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return await response.json();
  },
  
  // Availability Windows
  createWindow: async (windowData) => {
    const response = await fetch(`${API_BASE}/api/create-window`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(windowData)
    });
    return await response.json();
  },
  
  getWindows: async (userId) => {
    const response = await fetch(`${API_BASE}/api/windows?userId=${userId}`);
    return await response.json();
  },
  
  // Scheduling Links
  createLink: async (linkData) => {
    const response = await fetch(`${API_BASE}/api/create-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(linkData)
    });
    return await response.json();
  },
  
  getLinks: async (userId) => {
    const response = await fetch(`${API_BASE}/api/links?userId=${userId}`);
    return await response.json();
  },
  
  // Meeting Scheduling
  getAvailableTimes: async (linkId) => {
    const response = await fetch(`${API_BASE}/api/available-times/${linkId}`);
    return await response.json();
  },
  
  scheduleMeeting: async (linkId, bookingData) => {
    const response = await fetch(`${API_BASE}/api/schedule/${linkId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    return await response.json();
  },
  
  // Meetings Management
  getMeetings: async (userId, status = '') => {
    const url = new URL(`${API_BASE}/api/meetings`);
    url.searchParams.append('userId', userId);
    if (status) url.searchParams.append('status', status);
    
    const response = await fetch(url);
    return await response.json();
  },
  
  updateMeetingStatus: async (meetingId, status) => {
    const response = await fetch(`${API_BASE}/api/meetings/${meetingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await response.json();
  },
  
  deleteMeeting: async (meetingId) => {
    const response = await fetch(`${API_BASE}/api/meetings/${meetingId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    });
    return await response.json();
  }
};

export default apiService;