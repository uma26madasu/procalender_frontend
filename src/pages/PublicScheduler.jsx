import { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiService } from '../api';

// Form validation schema - moved outside component to prevent recreation
const createBookingSchema = (questions = []) => {
  const baseSchema = {
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Valid email is required"),
    linkedinUrl: z.string().url("Valid LinkedIn URL is required").optional().or(z.literal('')),
    selectedTime: z.string().min(1, "Please select a time"),
  };

  // Add dynamic question fields to schema
  questions.forEach(question => {
    baseSchema[question.id] = z.string().optional();
  });

  return z.object(baseSchema);
};

// Components for better organization
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

const ErrorDisplay = ({ message, onRetry }) => (
  <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
    <div className="p-4 bg-red-100 text-red-700 rounded-md">
      <p>{message}</p>
    </div>
    <button 
      onClick={onRetry}
      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const BookingConfirmation = ({ booking, meetingData }) => (
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
        <h3 className="font-semibold text-gray-700 mb-2">{meetingData.meetingName}</h3>
        <p className="text-gray-600">
          <span className="font-medium">Date:</span> {formatDate(booking.startTime)}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Time:</span> {formatTime(booking.startTime)}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Duration:</span> {meetingData.meetingLength} minutes
        </p>
      </div>
      
      <p className="text-sm text-gray-500">
        A confirmation email has been sent to your inbox with calendar invite.
      </p>
    </div>
  </div>
);

// Utility functions
const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatTime = (timeString) => {
  const time = new Date(timeString);
  return time.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
};

export default function PublicScheduler() {
  const { linkId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [linkData, setLinkData] = useState(null);
  const [availableTimes, setAvailableTimes] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [timesForSelectedDate, setTimesForSelectedDate] = useState([]);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  // Create schema based on dynamic questions
  const bookingSchema = useMemo(() => 
    createBookingSchema(linkData?.questions), 
    [linkData?.questions]
  );

  // Initialize form with dynamic schema
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(bookingSchema),
    mode: 'onBlur' // Validate on blur for better UX
  });

  // Load link data and available times
  useEffect(() => {
    const fetchLinkData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch link details and available times
        const linkResponse = await apiService.getAvailableTimes(linkId);
        
        if (!linkResponse.success) {
          throw new Error(linkResponse.message || 'Failed to load scheduling data');
        }
        
        setLinkData({
          meetingName: linkResponse.meetingName,
          meetingLength: linkResponse.meetingLength,
          questions: linkResponse.questions || []
        });
        
        const times = linkResponse.availableTimes || {};
        setAvailableTimes(times);
        
        // Set first date as selected by default if available
        const dates = Object.keys(times);
        if (dates.length > 0) {
          setSelectedDate(dates[0]);
          setTimesForSelectedDate(times[dates[0]]);
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

  // Update available times when date is selected - memoized to prevent recreation
  const handleDateChange = useCallback((date) => {
    setSelectedDate(date);
    setTimesForSelectedDate(availableTimes[date] || []);
    setValue('selectedTime', ''); // Clear previously selected time
  }, [availableTimes, setValue]);

  // Handle form submission - memoized to prevent recreation
  const onSubmit = useCallback(async (data) => {
    try {
      setLoading(true);
      setError('');
      
      // Add dynamic question answers to the data
      const questionAnswers = {};
      if (linkData?.questions) {
        linkData.questions.forEach(question => {
          questionAnswers[question.id] = data[question.id] || '';
        });
      }
      
      const bookingData = {
        name: data.name,
        email: data.email,
        linkedinUrl: data.linkedinUrl || '',
        selectedTime: data.selectedTime,
        questionAnswers
      };
      
      const response = await apiService.scheduleMeeting(linkId, bookingData);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to schedule meeting');
      }
      
      setBookingDetails(response.booking);
      setBookingComplete(true);
    } catch (err) {
      console.error('Error scheduling meeting:', err);
      setError('Failed to schedule meeting. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [linkData, linkId]);

  // Handle retry
  const handleRetry = useCallback(() => window.location.reload(), []);

  // Show loading state
  if (loading && !linkData) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (error) {
    return <ErrorDisplay message={error} onRetry={handleRetry} />;
  }

  // Show confirmation state
  if (bookingComplete) {
    return <BookingConfirmation booking={bookingDetails} meetingData={linkData} />;
  }

  // Main form view
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
                className={`p-2 text-center border rounded-md transition-colors ${
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
                  className={`p-2 text-center border rounded-md cursor-pointer transition-colors hover:bg-gray-50 ${
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
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              className={`w-full px-3 py-2 border rounded-md transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-3 py-2 border rounded-md transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="linkedinUrl">
              LinkedIn URL (optional)
            </label>
            <input
              id="linkedinUrl"
              type="url"
              {...register('linkedinUrl')}
              className={`w-full px-3 py-2 border rounded-md transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none ${
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
                <label 
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor={question.id}
                >
                  {question.label}
                </label>
                <textarea
                  id={question.id}
                  {...register(question.id)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md transition-colors focus:ring-2 focus:ring-blue-300 focus:outline-none"
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
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm disabled:opacity-50 transition-colors"
          >
            {loading ? 'Scheduling...' : 'Schedule Meeting'}
          </button>
        </div>
      </form>
    </div>
  );
}