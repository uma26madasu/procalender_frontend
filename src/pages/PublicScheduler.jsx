import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '../api';

// Form validation schema
const bookingSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  linkedinUrl: z.string().url("Valid LinkedIn URL is required").optional(),
  selectedTime: z.string().min(1, "Please select a time"),
  // Dynamic questions will be added to schema
});

export default function PublicScheduler() {
  const { linkId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linkData, setLinkData] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [timesForSelectedDate, setTimesForSelectedDate] = useState([]);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Initialize form with basic schema
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(bookingSchema)
  });

  // Load link data and available times
  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        setLoading(true);
        // In a real implementation, you would fetch link details first
        // Then fetch available times based on the link settings
        
        // Mock data for now - replace with actual API calls
        // In production, you would do:
        // const linkDetailsResponse = await apiService.getLinkDetails(linkId);
        // const availableTimesResponse = await apiService.getAvailableTimes(linkId);
        
        // Mock data
        setLinkData({
          meetingName: 'Initial Consultation',
          meetingLength: 30,
          questions: [
            { id: 'q1', label: 'What topics would you like to discuss?' },
            { id: 'q2', label: 'How did you hear about us?' }
          ]
        });
        
        // Mock available times - 7 days from now, with 3 slots per day
        const mockTimes = {};
        const now = new Date();
        
        for (let i = 0; i < 7; i++) {
          const date = new Date(now);
          date.setDate(date.getDate() + i + 1);
          const dateStr = date.toISOString().split('T')[0];
          
          mockTimes[dateStr] = [];
          
          // Add 3 time slots for each day (9am, 11am, 2pm)
          for (let hour of [9, 11, 14]) {
            const timeSlot = new Date(date);
            timeSlot.setHours(hour, 0, 0, 0);
            mockTimes[dateStr].push(timeSlot.toISOString());
          }
        }
        
        setAvailableTimes(mockTimes);
        
        // Set first date as selected by default if available
        const dates = Object.keys(mockTimes);
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
          setTimesForSelectedDate(mockTimes[dates[0]]);
        }
      } catch (err) {
        console.error('Error loading scheduler data:', err);
        setError('Unable to load scheduling data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLinkData();
  }, [linkId]);

  // Update available times when date is selected
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setTimesForSelectedDate(availableTimes[date] || []);
    setValue('selectedTime', ''); // Clear previously selected time
  };

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Add dynamic question answers to the data
      const questionAnswers = {};
      if (linkData.questions) {
        linkData.questions.forEach(question => {
          questionAnswers[question.id] = data[question.id];
        });
      }
      
      const bookingData = {
        ...data,
        linkId,
        questionAnswers
      };
      
      // In production, you would call your API:
      // const response = await apiService.scheduleMeeting(linkId, bookingData);
      
      // Mock successful booking for now
      const mockResponse = {
        success: true,
        booking: {
          id: 'bk' + Math.random().toString(36).substr(2, 9),
          startTime: data.selectedTime,
          endTime: new Date(new Date(data.selectedTime).getTime() + linkData.meetingLength * 60000).toISOString()
        }
      };
      
      setBookingDetails(mockResponse.booking);
      setBookingComplete(true);
    } catch (err) {
      console.error('Error scheduling meeting:', err);
      setError('Failed to schedule meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Format time for display
  const formatTime = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  };

  if (loading && !linkData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (bookingComplete) {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">Your meeting has been scheduled successfully.</p>
          
          <div className="bg-gray-50 p-4 rounded-lg text-left mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">{linkData.meetingName}</h3>
            <p className="text-gray-600">
              <span className="font-medium">Date:</span> {formatDate(bookingDetails.startTime)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Time:</span> {formatTime(bookingDetails.startTime)}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Duration:</span> {linkData.meetingLength} minutes
            </p>
          </div>
          
          <p className="text-sm text-gray-500">
            A confirmation email has been sent to your inbox with calendar invite.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-1">{linkData.meetingName}</h1>
      <p className="text-gray-500 mb-6">{linkData.meetingLength} minute meeting</p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Date Selection */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Select a Date</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.keys(availableTimes).map(date => (
              <button
                key={date}
                type="button"
                onClick={() => handleDateChange(date)}
                className={`p-2 text-center border rounded-md ${
                  selectedDate === date 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {formatDate(date)}
              </button>
            ))}
          </div>
          {Object.keys(availableTimes).length === 0 && (
            <p className="text-red-500 mt-2">No available times found.</p>
          )}
        </div>
        
        {/* Time Selection */}
        {selectedDate && (
          <div>
            <h2 className="text-lg font-semibold mb-3">Select a Time</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {timesForSelectedDate.map(time => (
                <label
                  key={time}
                  className={`p-2 text-center border rounded-md cursor-pointer ${
                    errors.selectedTime ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    {...register('selectedTime')}
                    value={time}
                    className="sr-only"
                    onChange={() => setValue('selectedTime', time)}
                  />
                  <span className={`block ${
                    errors.selectedTime ? 'text-red-500' : 'text-gray-700'
                  }`}>
                    {formatTime(time)}
                  </span>
                </label>
              ))}
            </div>
            {errors.selectedTime && (
              <p className="mt-1 text-sm text-red-600">{errors.selectedTime.message}</p>
            )}
          </div>
        )}
        
        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your Information</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              {...register('name')}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email')}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              LinkedIn URL (optional)
            </label>
            <input
              type="url"
              {...register('linkedinUrl')}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.linkedinUrl ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="https://linkedin.com/in/your-profile"
            />
            {errors.linkedinUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.linkedinUrl.message}</p>
            )}
          </div>
        </div>
        
        {/* Custom Questions */}
        {linkData.questions && linkData.questions.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Additional Information</h2>
            
            {linkData.questions.map(question => (
              <div key={question.id}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {question.label}
                </label>
                <textarea
                  {...register(question.id)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                ></textarea>
              </div>
            ))}
          </div>
        )}
        
        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-50"
          >
            {loading ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </div>
      </form>
    </div>
  );
}