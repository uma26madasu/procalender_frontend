import React, { useState, useEffect } from 'react';

// Simulated data fetch function
const fetchDashboardData = () => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve({
        upcomingMeetings: [
          { id: 1, title: 'Weekly Team Sync', date: '2025-05-16', time: '10:00 AM', attendees: 5 },
          { id: 2, title: 'Project Review', date: '2025-05-17', time: '2:00 PM', attendees: 3 }
        ],
        stats: {
          totalMeetings: 12,
          totalAttendees: 48
        },
        recentLinks: [
          { id: 1, name: 'Q2 Planning', created: '2025-05-10', clicks: 24, status: 'Active' },
          { id: 2, name: 'Customer Interview', created: '2025-05-12', clicks: 8, status: 'Active' },
          { id: 3, name: 'Sales Demo', created: '2025-05-14', clicks: 3, status: 'Active' }
        ]
      });
    }, 1500); // 1.5 second delay
  });
};

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    fetchDashboardData()
      .then(data => {
        setDashboardData(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      });
  }, []);

  // Simple loading state without the skeleton component
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Total Meetings</p>
                  <p className="text-gray-600">{dashboardData.stats.totalMeetings} scheduled</p>
                </div>
              </div>
              <button className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-sm">View All</button>
            </div>
          </div>
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="font-medium">Total Attendees</p>
                  <p className="text-gray-600">{dashboardData.stats.totalAttendees} participants</p>
                </div>
              </div>
              <button className="bg-green-50 text-green-600 px-3 py-1 rounded-md text-sm">Details</button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Windows</h2>
          <button className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm">Add New</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Duration</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Last Active</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-3 text-sm">Daily Check-in</td>
                <td className="py-3 px-3 text-sm">15 min</td>
                <td className="py-3 px-3 text-sm">Today</td>
                <td className="py-3 px-3 flex space-x-2">
                  <button className="text-blue-600 text-sm">Edit</button>
                  <button className="text-red-600 text-sm">Delete</button>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-3 text-sm">Team Sync</td>
                <td className="py-3 px-3 text-sm">30 min</td>
                <td className="py-3 px-3 text-sm">Yesterday</td>
                <td className="py-3 px-3 flex space-x-2">
                  <button className="text-blue-600 text-sm">Edit</button>
                  <button className="text-red-600 text-sm">Delete</button>
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-3 px-3 text-sm">Project Review</td>
                <td className="py-3 px-3 text-sm">45 min</td>
                <td className="py-3 px-3 text-sm">Last Week</td>
                <td className="py-3 px-3 flex space-x-2">
                  <button className="text-blue-600 text-sm">Edit</button>
                  <button className="text-red-600 text-sm">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Links</h2>
          <button className="bg-blue-600 text-white px-4 py-1 rounded-md text-sm">Create Link</button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Name</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Created</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Clicks</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Status</th>
                <th className="py-2 px-3 text-left text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.recentLinks.map(link => (
                <tr key={link.id} className="border-b border-gray-200">
                  <td className="py-3 px-3 text-sm">{link.name}</td>
                  <td className="py-3 px-3 text-sm">{link.created}</td>
                  <td className="py-3 px-3 text-sm">{link.clicks}</td>
                  <td className="py-3 px-3 text-sm">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{link.status}</span>
                  </td>
                  <td className="py-3 px-3 flex space-x-2">
                    <button className="p-1 text-gray-500 rounded-full hover:bg-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="text-blue-600 text-sm">Edit</button>
                    <button className="text-red-600 text-sm">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Upcoming Meetings</h2>
        <div className="space-y-4">
          {dashboardData.upcomingMeetings.map(meeting => (
            <div key={meeting.id} className="border rounded-md p-4">
              <div className="flex justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{meeting.title}</h3>
                  <p className="text-sm text-gray-600">{meeting.date}</p>
                  <p className="text-sm text-gray-600">{meeting.time}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">{meeting.attendees} Attendees</p>
                  <button className="text-blue-600 text-sm">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;