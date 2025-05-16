import { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithGoogle } from '../firebase/auth';
import { apiService } from '../api';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Welcome to your ProCalender dashboard!' },
    { id: 2, message: 'You have 2 upcoming meetings this week' }
  ]);
  
  // Stats data
  const stats = [
    { name: 'Total Meetings', value: '12' },
    { name: 'Upcoming', value: '3' },
    { name: 'Completed', value: '9' },
    { name: 'Scheduling Links', value: '2' }
  ];
  
  // Mock data
  const upcomingMeetings = [
    {
      id: 'm1',
      clientName: 'John Smith',
      clientEmail: 'john@example.com',
      startTime: '2025-05-14T10:00:00Z',
      endTime: '2025-05-14T10:30:00Z',
      meetingName: 'Initial Consultation'
    },
    {
      id: 'm2',
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah@example.com',
      startTime: '2025-05-15T14:00:00Z',
      endTime: '2025-05-15T14:45:00Z',
      meetingName: 'Follow-up Session'
    }
  ];
  
  const windows = [
    { id: 'w1', dayOfWeek: 'Monday', startHour: '09:00', endHour: '12:00' },
    { id: 'w2', dayOfWeek: 'Wednesday', startHour: '13:00', endHour: '17:00' },
    { id: 'w3', dayOfWeek: 'Friday', startHour: '10:00', endHour: '15:00' }
  ];
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };
  
  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{auth.currentUser?.email}</span>
              <button
                onClick={() => auth.signOut()}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="mb-6">
            {notifications.map(notification => (
              <div key={notification.id} className="flex items-center justify-between bg-blue-50 p-4 rounded-md mb-2">
                <p className="text-blue-700">{notification.message}</p>
                <button 
                  onClick={() => dismissNotification(notification.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mb-8">
          <dl className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="mt-1 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              to="/create-window"
              className="group relative bg-white p-6 focus:outline-none rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span className="inline-flex items-center justify-center rounded-md bg-blue-50 p-3 text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Create Availability Window</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Set your regular availability hours for meetings
                </p>
              </div>
            </Link>

            <Link
              to="/create-link"
              className="group relative bg-white p-6 focus:outline-none rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span className="inline-flex items-center justify-center rounded-md bg-green-50 p-3 text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Create Scheduling Link</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Generate a shareable booking link for clients
                </p>
              </div>
            </Link>

            <Link
              to="/meetings"
              className="group relative bg-white p-6 focus:outline-none rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div>
                <span className="inline-flex items-center justify-center rounded-md bg-purple-50 p-3 text-purple-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </span>
                <h3 className="mt-4 text-lg font-medium text-gray-900">View All Meetings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your upcoming and past meetings
                </p>
              </div>
            </Link>
          </div>
        </section>

        {/* Upcoming Meetings */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Upcoming Meetings</h2>
            <Link
              to="/meetings"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              View all
            </Link>
          </div>
          
          {upcomingMeetings.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {upcomingMeetings.map((meeting) => (
                  <li key={meeting.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                              {meeting.clientName.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              {meeting.meetingName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {meeting.clientName} ({meeting.clientEmail})
                            </p>
                          </div>
                        </div>
                        <div className="flex-shrink-0 text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatDate(meeting.startTime)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center text-gray-500">
              No upcoming meetings. Create a scheduling link to get started.
            </div>
          )}
        </section>

        {/* Availability Windows */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Your Availability Windows</h2>
            <Link
              to="/create-window"
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Add window
            </Link>
          </div>
          
          {windows.length > 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {windows.map((window) => (
                  <li key={window.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {window.dayOfWeek}
                          </p>
                          <p className="text-sm text-gray-500">
                            {window.startHour} - {window.endHour}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Edit</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center text-gray-500">
              No availability windows set. Add your first one to start scheduling.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}