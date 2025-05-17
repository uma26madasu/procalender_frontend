// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../api';
// Other imports...

function Dashboard() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        // Your existing data fetching logic
        
        // For debugging - add console logs
        console.log("Dashboard component mounted");
        
        // Set your data
        setDashboardData({ /* your data */ });
        setIsLoading(false);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError(err.message || "An error occurred loading the dashboard");
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  // Add error state rendering
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-red-500">
              <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Dashboard Error</h2>
            <p className="mt-2 text-sm text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Add loading state rendering
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="ml-3">Loading dashboard...</p>
      </div>
    );
  }
  
  // Your existing rendering code
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Debug output */}
      <div className="bg-yellow-100 p-4 mb-4 rounded">
        <p>Debug info: Dashboard rendered successfully</p>
        <p>Data available: {dashboardData ? 'Yes' : 'No'}</p>
      </div>
      
      {/* Your actual dashboard content */}
      {/* ... */}
    </div>
  );
}

export default Dashboard;