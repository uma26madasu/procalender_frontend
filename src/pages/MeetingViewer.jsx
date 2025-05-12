import { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { apiService } from '../api';

export default function MeetingViewer() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, you would fetch meetings from your API
        // const response = await apiService.getMeetings(auth.currentUser.uid);
        
        // Mock data for development
        const mockMeetings = [
          {
            id: 'm1',
            clientName: 'John Smith',
            clientEmail: 'john@example.com',
            startTime: '2025-05-14T10:00:00Z',
            endTime: '2025-05-14T10:30:00Z',
            meetingName: 'Initial Consultation',
            status: 'confirmed',
            linkId: 'l1',
            questions: [
              { question: 'What topics would you like to discuss?', answer: 'Retirement planning and investment strategies' }
            ]
          },
          {
            id: 'm2',
            clientName: 'Sarah Johnson',
            clientEmail: 'sarah@example.com',
            startTime: '2025-05-15T14:00:00Z',
            endTime: '2025-05-15T14:45:00Z',
            meetingName: 'Follow-up Session',
            status: 'confirmed',
            linkId: 'l2',
            questions: [
              { question: 'What topics would you like to discuss?', answer: 'Tax planning for small business' },
              { question: 'How did you hear about us?', answer: 'Referral from a friend' }
            ]
          },
          {
            id: 'm3',
            clientName: 'David Lee',
            clientEmail: 'david@example.com',
            startTime: '2025-04-30T09:00:00Z',
            endTime: '2025-04-30T09:30:00Z',
            meetingName: 'Initial Consultation',
            status: 'completed',
            linkId: 'l1',
            questions: [
              { question: 'What topics would you like to discuss?', answer: 'Estate planning options' }
            ]
          }
        ];
        
        setMeetings(mockMeetings);
      } catch (err) {
        console.error('Error fetching meetings:', err);
        setError('Failed to load meetings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeetings();
  }, []);

  // Filter meetings based on selected filter
  const filteredMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime);
    const now = new Date();
    
    if (filter === 'upcoming') {
      return meetingDate > now;
    } else if (filter === 'past') {
      return meetingDate < now;
    }
    return true; // 'all' filter
  });

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (dateString) => {
    const options = { hour: 'numeric', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // View meeting details
  const viewMeetingDetails = (meeting) => {
    setSelectedMeeting(meeting);
  };

  // Close meeting details modal
  const closeMeetingDetails = () => {
    setSelectedMeeting(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Your Meetings</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-4 py-2 rounded-md ${
                filter === 'upcoming'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setFilter('past')}
              className={`px-4 py-2 rounded-md ${
                filter === 'past'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Past
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {/* Meetings List */}
        {filteredMeetings.length > 0 ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Meeting Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMeetings.map((meeting) => (
                  <tr key={meeting.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{meeting.clientName}</div>
                      <div className="text-sm text-gray-500">{meeting.clientEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{meeting.meetingName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(meeting.startTime)}</div>
                      <div className="text-sm text-gray-500">
                        {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        meeting.status === 'confirmed'
                          ? 'bg-green-100 text-green-800'
                          : meeting.status === 'completed'
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => viewMeetingDetails(meeting)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="bg-white p-8 text-center rounded-lg shadow">
            <p className="text-gray-500">No {filter} meetings found.</p>
          </div>
        )}
      </main>

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" id="meeting-modal">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center pb-3">
              <h3 className="text-xl font-semibold text-gray-900">{selectedMeeting.meetingName}</h3>
              <button
                onClick={closeMeetingDetails}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4">
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Client</h4>
                <p className="mt-1 text-sm text-gray-900">{selectedMeeting.clientName} ({selectedMeeting.clientEmail})</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Date & Time</h4>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(selectedMeeting.startTime)}, {formatTime(selectedMeeting.startTime)} - {formatTime(selectedMeeting.endTime)}
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500">Status</h4>
                <p className="mt-1">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    selectedMeeting.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : selectedMeeting.status === 'completed'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedMeeting.status.charAt(0).toUpperCase() + selectedMeeting.status.slice(1)}
                  </span>
                </p>
              </div>
              
              {selectedMeeting.questions && selectedMeeting.questions.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-500">Questions</h4>
                  <div className="mt-1 space-y-2">
                    {selectedMeeting.questions.map((q, index) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-3">
                        <p className="text-sm font-medium text-gray-700">{q.question}</p>
                        <p className="text-sm text-gray-600">{q.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={closeMeetingDetails}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700"
                >
                  Cancel Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}