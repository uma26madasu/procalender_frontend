import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/auth';

const BookingLinks = () => {
  const { user } = useAuth();
  const [bookingLinks, setBookingLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch user's booking links from your backend/Firebase
    setLoading(false);
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Booking Links</h1>
        <p className="text-gray-600">Manage and share your scheduling links</p>
      </div>

      {/* Create New Link Button */}
      <div className="mb-6">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
          + Create New Booking Link
        </button>
      </div>

      {/* Booking Links List */}
      <div className="bg-white rounded-lg shadow">
        {bookingLinks.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mb-4">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No booking links yet</h3>
            <p className="text-gray-500 mb-4">Create your first booking link to start accepting appointments</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
              Create Your First Link
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {bookingLinks.map((link, index) => (
              <div key={index} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{link.title}</h3>
                    <p className="text-sm text-gray-500">{link.url}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Copy Link
                    </button>
                    <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingLinks;