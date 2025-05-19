import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import MainLayout from '../components/layout/MainLayout';
import { Card, Button, Badge, Modal, Alert } from '../components/UI';

export default function MeetingViewer() {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Filter tabs
  const filterTabs = [
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past' },
    { id: 'all', label: 'All Meetings' }
  ];

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay for demonstration
        setTimeout(() => {
          // Mock data with approval statuses
          const mockMeetings = [
            {
              id: 'm1',
              clientName: 'John Smith',
              clientEmail: 'john@example.com',
              startTime: '2025-05-24T10:00:00Z',
              endTime: '2025-05-24T10:30:00Z',
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
              startTime: '2025-05-25T14:00:00Z',
              endTime: '2025-05-25T14:45:00Z',
              meetingName: 'Follow-up Session',
              status: 'pending',
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
              startTime: '2025-05-14T09:00:00Z',
              endTime: '2025-05-14T09:30:00Z',
              meetingName: 'Initial Consultation',
              status: 'completed',
              linkId: 'l1',
              questions: [
                { question: 'What topics would you like to discuss?', answer: 'Estate planning options' }
              ]
            },
            {
              id: 'm4',
              clientName: 'Emma Wilson',
              clientEmail: 'emma@example.com',
              startTime: '2025-05-13T11:00:00Z',
              endTime: '2025-05-13T12:00:00Z',
              meetingName: 'Strategy Session',
              status: 'rejected',
              linkId: 'l3',
              questions: [
                { question: 'What are your business goals?', answer: 'Expanding to new markets in the next year' }
              ],
              rejectionReason: 'Not available at the requested time'
            },
            {
              id: 'm5',
              clientName: 'Michael Brown',
              clientEmail: 'michael@example.com',
              startTime: '2025-05-26T15:00:00Z',
              endTime: '2025-05-26T15:45:00Z',
              meetingName: 'Consultation',
              status: 'pending',
              linkId: 'l4',
              questions: [
                { question: 'What services are you interested in?', answer: 'Financial planning and investment advice' }
              ]
            }
          ];
          
          setMeetings(mockMeetings);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching meetings:', err);
        setError('Failed to load meetings. Please try again.');
        setLoading(false);
      }
    };
    
    fetchMeetings();
  }, []);

  const updateMeetingStatus = async (meetingId, newStatus, reason = '') => {
    try {
      setCancelLoading(true);
      setApprovalLoading(true);
      
      // Simulate API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the meeting in the local state
      setMeetings(meetings.map(meeting => 
        meeting.id === meetingId ? { 
          ...meeting, 
          status: newStatus,
          ...(reason && { rejectionReason: reason })
        } : meeting
      ));
      
      // Close modals and show success message
      setShowCancelModal(false);
      setShowRejectionModal(false);
      if (selectedMeeting && selectedMeeting.id === meetingId) {
        setSelectedMeeting({ 
          ...selectedMeeting, 
          status: newStatus,
          ...(reason && { rejectionReason: reason })
        });
      }
      
      let action = '';
      if (newStatus === 'canceled') action = 'canceled';
      else if (newStatus === 'confirmed') action = 'approved';
      else if (newStatus === 'rejected') action = 'rejected';
      else action = 'updated';
      
      setSuccessMessage(`Meeting ${action} successfully.`);
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      
    } catch (err) {
      console.error(`Error updating meeting status:`, err);
      setError(`Failed to update meeting status. Please try again.`);
    } finally {
      setCancelLoading(false);
      setApprovalLoading(false);
      setRejectionReason('');
    }
  };

  const handleCancelMeeting = () => {
    if (selectedMeeting) {
      setShowCancelModal(true);
    }
  };

  const confirmCancelMeeting = async () => {
    await updateMeetingStatus(selectedMeeting.id, 'canceled');
  };

  const handleCompleteMeeting = async () => {
    if (selectedMeeting) {
      await updateMeetingStatus(selectedMeeting.id, 'completed');
    }
  };

  const handleApproveMeeting = async (meetingId) => {
    await updateMeetingStatus(meetingId, 'confirmed');
  };

  const handleRejectMeeting = async (meetingId, reason) => {
    await updateMeetingStatus(meetingId, 'rejected', reason);
  };

  // Filter meetings based on selected filter
  const filteredMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.startTime);
    const now = new Date();
    
    if (filter === 'upcoming') {
      return meetingDate > now && !['canceled', 'rejected'].includes(meeting.status);
    } else if (filter === 'past') {
      return meetingDate < now || ['completed', 'canceled', 'rejected'].includes(meeting.status);
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

  // Check if a meeting is today
  const isToday = (dateString) => {
    const today = new Date();
    const meetingDate = new Date(dateString);
    return (
      meetingDate.getDate() === today.getDate() &&
      meetingDate.getMonth() === today.getMonth() &&
      meetingDate.getFullYear() === today.getFullYear()
    );
  };

  // View meeting details
  const viewMeetingDetails = (meeting) => {
    setSelectedMeeting(meeting);
  };

  // Close meeting details modal
  const closeMeetingDetails = () => {
    setSelectedMeeting(null);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const variants = {
      confirmed: 'success',
      completed: 'secondary',
      canceled: 'danger',
      pending: 'warning',
      rejected: 'danger'
    };
    
    const labels = {
      confirmed: 'Confirmed',
      completed: 'Completed',
      canceled: 'Canceled',
      pending: 'Pending Approval',
      rejected: 'Rejected'
    };
    
    return (
      <Badge variant={variants[status] || 'secondary'} rounded>
        {labels[status] || status}
      </Badge>
    );
  };

  // Loading skeleton
  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
            ))}
          </div>
          
          <Card>
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-5 bg-gray-200 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    filter === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Success message */}
      {successMessage && (
        <Alert 
          type="success" 
          message={successMessage} 
          onClose={() => setSuccessMessage('')}
          className="mb-6"
        />
      )}
      
      {/* Error message */}
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError('')}
          className="mb-6"
        />
      )}

      {/* Meetings List */}
      <Card>
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          {filter === 'upcoming' ? 'Upcoming Meetings' : 
           filter === 'past' ? 'Past Meetings' : 'All Meetings'}
        </h3>
        
        {filteredMeetings.length > 0 ? (
          <div className="space-y-6">
            {filteredMeetings.map((meeting) => (
              <div 
                key={meeting.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => viewMeetingDetails(meeting)}
              >
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                    {meeting.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{meeting.clientName}</p>
                    <p className="text-sm text-gray-500">{meeting.clientEmail}</p>
                  </div>
                </div>
                
                <div className="mt-3 sm:mt-0 flex flex-col sm:items-center">
                  <p className="font-medium text-gray-900">{meeting.meetingName}</p>
                  <p className="text-sm text-gray-500">
                    {isToday(meeting.startTime) ? 'Today' : formatDate(meeting.startTime)}, {formatTime(meeting.startTime)}
                  </p>
                </div>
                
                <div className="mt-3 sm:mt-0 flex items-center">
                  <StatusBadge status={meeting.status} />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      viewMeetingDetails(meeting);
                    }}
                    className="ml-4 text-indigo-600 hover:text-indigo-800"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="mt-2 text-base font-medium text-gray-900">No meetings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'upcoming' 
                ? 'You have no upcoming meetings scheduled.' 
                : filter === 'past' 
                ? 'You have no past meetings.' 
                : 'You have no meetings scheduled.'}
            </p>
            <div className="mt-6">
              <Button 
                variant="primary"
                onClick={() => window.location.href = '/create-link'}
              >
                Create Booking Link
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Meeting Details Modal */}
      {selectedMeeting && (
        <Modal
          isOpen={!!selectedMeeting}
          onClose={closeMeetingDetails}
          title={selectedMeeting.meetingName}
          size="lg"
          footer={
            <>
              <Button
                variant="secondary"
                onClick={closeMeetingDetails}
              >
                Close
              </Button>
              
              {selectedMeeting.status === 'confirmed' && (
                <>
                  <Button
                    variant="success"
                    onClick={handleCompleteMeeting}
                    className="ml-3"
                  >
                    Mark as Completed
                  </Button>
                  <Button
                    variant="danger"
                    onClick={handleCancelMeeting}
                    className="ml-3"
                  >
                    Cancel Meeting
                  </Button>
                </>
              )}
              
              {selectedMeeting.status === 'pending' && (
                <>
                  <Button
                    variant="success"
                    onClick={() => handleApproveMeeting(selectedMeeting.id)}
                    isLoading={approvalLoading}
                    className="ml-3"
                  >
                    Approve Meeting
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setShowRejectionModal(true)}
                    className="ml-3"
                  >
                    Reject Meeting
                  </Button>
                </>
              )}
            </>
          }
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Client Information</h4>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                    {selectedMeeting.clientName.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{selectedMeeting.clientName}</p>
                    <p className="text-sm text-gray-500">{selectedMeeting.clientEmail}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Meeting Details</h4>
                <p className="font-medium text-gray-900">
                  {isToday(selectedMeeting.startTime) ? 'Today' : formatDate(selectedMeeting.startTime)}
                </p>
                <p className="text-gray-500">
                  {formatTime(selectedMeeting.startTime)} - {formatTime(selectedMeeting.endTime)}
                </p>
                <div className="mt-2">
                  <StatusBadge status={selectedMeeting.status} />
                </div>
              </div>
            </div>
            
            {selectedMeeting.rejectionReason && (
              <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                <h4 className="text-sm font-medium text-red-800 mb-1">Rejection Reason</h4>
                <p className="text-sm text-red-700">{selectedMeeting.rejectionReason}</p>
              </div>
            )}
            
            {selectedMeeting.questions && selectedMeeting.questions.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Questionnaire Responses</h4>
                <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                  {selectedMeeting.questions.map((q, index) => (
                    <div key={index} className="border-l-2 border-indigo-200 pl-4">
                      <p className="text-sm font-medium text-gray-700">{q.question}</p>
                      <p className="text-sm text-gray-600 mt-1">{q.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 uppercase mb-2">Calendar Integration</h4>
              <div className="space-x-3">
                <Button 
                  variant="secondary" 
                  size="sm"
                  icon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  }
                >
                  Add to Google Calendar
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  icon={
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  }
                >
                  Download ICS File
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Meeting Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Meeting"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowCancelModal(false)}
              disabled={cancelLoading}
            >
              Keep Meeting
            </Button>
            <Button
              variant="danger"
              onClick={confirmCancelMeeting}
              isLoading={cancelLoading}
              className="ml-3"
            >
              {cancelLoading ? 'Canceling...' : 'Yes, Cancel Meeting'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg text-red-700">
            <div className="flex">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Are you sure you want to cancel this meeting?</p>
            </div>
          </div>
          
          {selectedMeeting && (
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Meeting:</span> {selectedMeeting.meetingName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Client:</span> {selectedMeeting.clientName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Date & Time:</span> {formatDate(selectedMeeting.startTime)}, {formatTime(selectedMeeting.startTime)}
              </p>
            </div>
          )}
          
          <p className="text-gray-500 text-sm">
            Canceling this meeting will send a notification to the client and remove it from both of your calendars.
          </p>
        </div>
      </Modal>

      {/* Rejection Reason Modal */}
      <Modal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        title="Reject Meeting"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowRejectionModal(false)}
              disabled={approvalLoading}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleRejectMeeting(selectedMeeting.id, rejectionReason)}
              isLoading={approvalLoading}
              className="ml-3"
            >
              {approvalLoading ? 'Rejecting...' : 'Confirm Rejection'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
            <div className="flex">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Are you sure you want to reject this meeting request?</p>
            </div>
          </div>
          
          {selectedMeeting && (
            <div>
              <p className="text-gray-700">
                <span className="font-medium">Meeting:</span> {selectedMeeting.meetingName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Client:</span> {selectedMeeting.clientName}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Date & Time:</span> {formatDate(selectedMeeting.startTime)}, {formatTime(selectedMeeting.startTime)}
              </p>
            </div>
          )}
          
          <div>
            <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-1">
              Rejection Reason (optional)
            </label>
            <textarea
              id="rejectionReason"
              rows="3"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              placeholder="Provide a reason for rejecting this meeting..."
            ></textarea>
            <p className="text-sm text-gray-500 mt-1">
              This reason will be included in the notification to the client.
            </p>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
}