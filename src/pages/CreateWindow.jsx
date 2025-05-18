import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import MainLayout from '../components/layout/MainLayout';
import { Card, Button, Alert, Badge } from '../components/UI';

export default function CreateWindow() {
  const navigate = useNavigate();
  const [windows, setWindows] = useState([
    // Sample existing windows (would be fetched from API in a real app)
    {
      id: 'w1',
      dayOfWeek: 'Monday',
      startHour: '09:00',
      endHour: '17:00'
    },
    {
      id: 'w2',
      dayOfWeek: 'Wednesday',
      startHour: '13:00',
      endHour: '18:00'
    }
  ]);
  
  const [dayOfWeek, setDayOfWeek] = useState('Monday');
  const [startHour, setStartHour] = useState('09:00');
  const [endHour, setEndHour] = useState('17:00');
  const [name, setName] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'manage'

  const dayOptions = [
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
  ];

  // Generate time options in 15-minute increments
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const hourFormatted = hour.toString().padStart(2, '0');
        const minuteFormatted = minute.toString().padStart(2, '0');
        options.push(`${hourFormatted}:${minuteFormatted}`);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  // Validate time selection
  const validateTimes = () => {
    if (startHour >= endHour) {
      setError('End time must be after start time');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    // Validate times
    if (!validateTimes()) {
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Get current user ID from Firebase auth
      const userId = auth.currentUser?.uid;
      
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would send this data to your API
      const newWindow = {
        id: `w${Date.now()}`, // Generate a temporary ID
        dayOfWeek,
        startHour,
        endHour,
        name: name || undefined
      };
      
      // Update local state with new window
      setWindows([...windows, newWindow]);
      
      // Show success message
      setSuccess('Availability window created successfully!');
      
      // Reset form
      setName('');
      
      // Switch to manage tab
      setActiveTab('manage');
      
    } catch (err) {
      console.error('Error creating availability window:', err);
      setError(err.message || 'Failed to create availability window');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (windowId) => {
    if (window.confirm('Are you sure you want to delete this availability window?')) {
      try {
        setIsSubmitting(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Filter out the deleted window
        setWindows(windows.filter(window => window.id !== windowId));
        
        setSuccess('Availability window deleted successfully');
      } catch (err) {
        setError('Failed to delete availability window');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Format time for display (24h to 12h)
  const formatTime = (time24h) => {
    const [hour, minute] = time24h.split(':');
    const hour12 = (parseInt(hour) % 12) || 12;
    const ampm = parseInt(hour) >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minute} ${ampm}`;
  };

  return (
    <MainLayout>
      {/* Tabs for Create/Manage */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('create')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'create'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Create Availability
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
                  activeTab === 'manage'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              Manage Availability
            </button>
          </nav>
        </div>
      </div>
      
      {/* Success/Error Messages */}
      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
          className="mb-6"
        />
      )}
      
      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess('')}
          className="mb-6"
        />
      )}
      
      {/* Create Availability Form */}
      {activeTab === 'create' && (
        <Card>
          <h2 className="text-lg font-medium text-gray-900 mb-6">Set Your Weekly Availability</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 mb-1">
                  Day of Week
                </label>
                <select
                  id="dayOfWeek"
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  {dayOptions.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Window Name (Optional)
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Working Hours, Evening Availability"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="startHour" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <select
                  id="startHour"
                  value={startHour}
                  onChange={(e) => setStartHour(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  {timeOptions.map((time) => (
                    <option key={`start-${time}`} value={time}>{formatTime(time)}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="endHour" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <select
                  id="endHour"
                  value={endHour}
                  onChange={(e) => setEndHour(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  {timeOptions.map((time) => (
                    <option key={`end-${time}`} value={time}>{formatTime(time)}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Preview Card */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Availability Preview</h3>
              <div className="flex items-center">
                <Badge variant="primary" rounded>{dayOfWeek}</Badge>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-gray-700">{formatTime(startHour)} - {formatTime(endHour)}</span>
                <span className="mx-2 text-gray-500">•</span>
                <span className="text-gray-700">
                  {(() => {
                    const start = new Date(`1970-01-01T${startHour}:00`);
                    const end = new Date(`1970-01-01T${endHour}:00`);
                    const diff = (end - start) / (1000 * 60 * 60); // hours
                    return `${diff} ${diff === 1 ? 'hour' : 'hours'}`;
                  })()}
                </span>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/dashboard')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Create Availability Window
              </Button>
            </div>
          </form>
        </Card>
      )}
      
      {/* Manage Existing Windows */}
      {activeTab === 'manage' && (
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium text-gray-900">Your Availability Windows</h2>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => setActiveTab('create')}
            >
              Add New
            </Button>
          </div>
          
          {windows.length > 0 ? (
            <div className="space-y-4">
              {windows.map((window) => (
                <div 
                  key={window.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center">
                      <Badge variant="primary" rounded>{window.dayOfWeek}</Badge>
                      {window.name && (
                        <>
                          <span className="mx-2 text-gray-500">•</span>
                          <span className="font-medium text-gray-900">{window.name}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-700 mt-1">
                      {formatTime(window.startHour)} - {formatTime(window.endHour)}
                    </p>
                  </div>
                  
                  <div className="mt-3 sm:mt-0 space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        // Pre-fill form with this window's data
                        setDayOfWeek(window.dayOfWeek);
                        setStartHour(window.startHour);
                        setEndHour(window.endHour);
                        setName(window.name || '');
                        setActiveTab('create');
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(window.id)}
                      disabled={isSubmitting}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-base font-medium text-gray-900">No availability windows</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't set any availability windows yet.
              </p>
              <div className="mt-6">
                <Button
                  variant="primary"
                  onClick={() => setActiveTab('create')}
                >
                  Create Your First Window
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
      
      {/* Help Information */}
      <div className="mt-6">
        <Card className="bg-indigo-50 border border-indigo-100">
          <h3 className="text-sm font-medium text-indigo-800 mb-2">About Availability Windows</h3>
          <p className="text-sm text-indigo-700">
            Availability windows define when you're available for meetings on a weekly basis. 
            Create multiple windows to set different hours for different days.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-3 rounded border border-indigo-100">
              <h4 className="text-xs font-medium text-indigo-800 uppercase mb-1">Recurring Schedule</h4>
              <p className="text-xs text-gray-600">
                Windows repeat weekly until you change or delete them
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-indigo-100">
              <h4 className="text-xs font-medium text-indigo-800 uppercase mb-1">Calendar Blocking</h4>
              <p className="text-xs text-gray-600">
                Meetings are only scheduled during your available windows
              </p>
            </div>
            <div className="bg-white p-3 rounded border border-indigo-100">
              <h4 className="text-xs font-medium text-indigo-800 uppercase mb-1">Conflict Prevention</h4>
              <p className="text-xs text-gray-600">
                Slots are automatically blocked when you have existing meetings
              </p>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}