// src/api/index.js
const API_BASE = import.meta.env.VITE_API_URL || 'https://procalender-backend.onrender.com';

console.log('API Base URL:', API_BASE);

// Mock implementations for development - replace with actual API calls later
export const apiService = {
  // Auth and Users
  createUser: async (userData) => {
    console.log('API call: createUser', userData);
    return { success: true, userId: 'mock-user-id' };
  },
  
  // Google Calendar OAuth
  getGoogleAuthUrl: async () => {
    console.log('API call: getGoogleAuthUrl');
    return { 
      success: true, 
      url: 'https://accounts.google.com/o/oauth2/auth?client_id=mock-client-id&redirect_uri=http://localhost:3000/auth/google/callback&scope=https://www.googleapis.com/auth/calendar&response_type=code' 
    };
  },
  
  connectGoogleCalendar: async (code, userId) => {
    console.log('API call: connectGoogleCalendar', { code, userId });
    return { success: true };
  },
  
  disconnectGoogleCalendar: async (userId) => {
    console.log('API call: disconnectGoogleCalendar', userId);
    return { success: true };
  },
  
  // Availability Windows
  createWindow: async (windowData) => {
    console.log('API call: createWindow', windowData);
    return { success: true, windowId: 'mock-window-id' };
  },
  
  // Scheduling Links
  createLink: async (linkData) => {
    console.log('API call: createLink', linkData);
    return { 
      success: true, 
      linkId: 'mock-link-id',
      linkUrl: `https://procalender-frontend.vercel.app/schedule/mock-link-id` 
    };
  },
  
  // Meetings
  getAvailableTimes: async (linkId) => {
    console.log('API call: getAvailableTimes', linkId);
    // Generate some mock available times
    const today = new Date();
    const availableTimes = {};
    
    // Add times for the next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Add time slots from 9 AM to 5 PM
      const times = [];
      for (let hour = 9; hour < 17; hour++) {
        const time = new Date(date);
        time.setHours(hour, 0, 0);
        times.push(time.toISOString());
      }
      
      availableTimes[dateStr] = times;
    }
    
    return {
      success: true,
      meetingName: 'Mock Meeting',
      meetingLength: 30,
      questions: [{ id: 'q1', label: 'What would you like to discuss?' }],
      availableTimes
    };
  },
  
  scheduleMeeting: async (linkId, bookingData) => {
    console.log('API call: scheduleMeeting', { linkId, bookingData });
    return {
      success: true,
      booking: {
        id: 'mock-booking-id',
        startTime: bookingData.selectedTime,
        endTime: new Date(new Date(bookingData.selectedTime).getTime() + 30 * 60000).toISOString()
      }
    };
  },
  
  updateMeetingStatus: async (meetingId, status) => {
    console.log('API call: updateMeetingStatus', { meetingId, status });
    return { success: true };
  },
  
  getMeetings: async (userId) => {
    console.log('API call: getMeetings', userId);
    return { success: true, meetings: [] };
  }
};

// Also export as default for flexibility
export default apiService;