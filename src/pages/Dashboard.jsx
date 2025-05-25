import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import googleCalendarService from '../utils/googleCalendar';
import MeetingDetailsModal from '../components/MeetingDetailsModal';
import SmartAvailabilitySettings from '../components/SmartAvailabilitySettings';
import {
  Calendar,
  Clock,
  Users,
  Settings,
  BarChart3,
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  User,
  LogOut,
  Home,
  CalendarDays,
  LinkIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Video,
  Mail,
  Phone,
  MapPin,
  Edit,
  Trash2,
  Eye,
  Copy,
  Share2,
  TrendingUp,
  TrendingDown,
  Edit3,
  Download,
  Activity,
  Target
} from 'lucide-react';

// Interactive Stats Card with trends and actions
const InteractiveStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color = "blue",
  trend,
  change,
  onClick,
  quickActions = []
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (onClick) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
      onClick();
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-gray-500';
    return trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-500';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  return (
    <div 
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 cursor-pointer transform transition-all duration-200 hover:shadow-lg hover:scale-105 ${
        isAnimating ? 'animate-pulse' : ''
      } ${onClick ? 'hover:border-' + color + '-200' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <div className="flex items-baseline space-x-2 mt-2">
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            {change && (
              <div className={`flex items-center text-xs ${getTrendColor()}`}>
                {getTrendIcon()}
                <span className="ml-1">{change}</span>
              </div>
            )}
          </div>
          
          {/* Progress bar for visual representation */}
          <div className="mt-3 bg-gray-200 rounded-full h-1">
            <div 
              className={`bg-${color}-500 h-1 rounded-full transition-all duration-1000`}
              style={{ width: `${Math.min((parseInt(value) / 20) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="relative">
          <div className={`p-3 rounded-full bg-${color}-100 transition-all duration-200 ${
            showActions ? 'transform rotate-12 scale-110' : ''
          }`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
          
          {/* Quick actions on hover */}
          {showActions && quickActions.length > 0 && (
            <div className="absolute top-0 right-12 bg-white rounded-lg shadow-lg border border-gray-200 p-2 z-10">
              <div className="space-y-1">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                    }}
                    className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left"
                  >
                    <action.icon className="h-4 w-4" />
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Enhanced Today's Meetings Section
const InteractiveTodaysMeetings = ({ 
  meetings, 
  onCreateMeeting, 
  onViewAllMeetings,
  calendarConnected,
  onConnectCalendar 
}) => {
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [quickMeetingTitle, setQuickMeetingTitle] = useState('');

  const todaysMeetings = meetings.filter(meeting => {
    const today = new Date();
    const meetingDate = new Date(meeting.start);
    return meetingDate.toDateString() === today.toDateString();
  });

  const handleQuickCreate = (e) => {
    e.preventDefault();
    if (quickMeetingTitle.trim()) {
      onCreateMeeting(quickMeetingTitle);
      setQuickMeetingTitle('');
      setShowQuickCreate(false);
    }
  };

  const getTimeUntilMeeting = (meeting) => {
    const now = new Date();
    const meetingTime = new Date(meeting.start);
    const diffMinutes = Math.floor((meetingTime - now) / (1000 * 60));
    
    if (diffMinutes < 0) return 'In progress';
    if (diffMinutes < 60) return `In ${diffMinutes}m`;
    if (diffMinutes < 1440) return `In ${Math.floor(diffMinutes / 60)}h ${diffMinutes % 60}m`;
    return 'Later today';
  };

  const getUrgencyColor = (meeting) => {
    const now = new Date();
    const meetingTime = new Date(meeting.start);
    const diffMinutes = Math.floor((meetingTime - now) / (1000 * 60));
    
    if (diffMinutes < 0) return 'border-l-green-500 bg-green-50';
    if (diffMinutes < 15) return 'border-l-red-500 bg-red-50';
    if (diffMinutes < 60) return 'border-l-yellow-500 bg-yellow-50';
    return 'border-l-blue-500 bg-blue-50';
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
            Today's Meetings
            {todaysMeetings.length > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {todaysMeetings.length}
              </span>
            )}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {!showQuickCreate ? (
            <>
              <button
                onClick={() => setShowQuickCreate(true)}
                className="flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
              >
                <Plus className="h-4 w-4 mr-1" />
                Quick Add
              </button>
              <button
                onClick={onViewAllMeetings}
                className="flex items-center px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Eye className="h-4 w-4 mr-1" />
                View All
              </button>
            </>
          ) : (
            <form onSubmit={handleQuickCreate} className="flex items-center space-x-2">
              <input
                type="text"
                value={quickMeetingTitle}
                onChange={(e) => setQuickMeetingTitle(e.target.value)}
                placeholder="Meeting title..."
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowQuickCreate(false);
                  setQuickMeetingTitle('');
                }}
                className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {todaysMeetings.length > 0 ? (
        <div className="space-y-3">
          {todaysMeetings.map((meeting, index) => (
            <div 
              key={meeting.id} 
              className={`border-l-4 rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer ${getUrgencyColor(meeting)}`}
              onClick={() => console.log('View meeting details:', meeting)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold text-gray-900">{meeting.title}</h4>
                    {meeting.platform && (
                      <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                        {meeting.platform === 'google' ? '📅 Google' : meeting.platform}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {meeting.time}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {(meeting.attendees?.length || 0) + 1} attendees
                    </div>
                    {meeting.hangoutLink && (
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-1 text-green-600" />
                        Video call
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium text-gray-600 bg-white px-2 py-1 rounded-full">
                    {getTimeUntilMeeting(meeting)}
                  </span>
                  
                  <div className="flex items-center space-x-1">
                    {meeting.hangoutLink && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(meeting.hangoutLink, '_blank');
                        }}
                        className="p-1 text-green-600 hover:bg-green-100 rounded"
                        title="Join Video Call"
                      >
                        <Video className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit meeting:', meeting);
                      }}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded"
                      title="Edit Meeting"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No meetings scheduled for today</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto">
            {calendarConnected 
              ? "You have a free day ahead! Perfect time to focus on deep work or plan ahead."
              : "Connect your Google Calendar to see your meetings here and get the full experience."
            }
          </p>
          
          <div className="flex items-center justify-center space-x-3">
            {calendarConnected ? (
              <>
                <button
                  onClick={onCreateMeeting}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Meeting
                </button>
                <button
                  onClick={onViewAllMeetings}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 inline-flex items-center transition-colors"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Calendar
                </button>
              </>
            ) : (
              <button
                onClick={onConnectCalendar}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 inline-flex items-center transition-all transform hover:scale-105"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Connect Google Calendar
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Booking Link Modal Component
const BookingLinkModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '30',
    bufferTime: '5',
    location: 'video-call',
    customLocation: '',
    availability: 'working-hours',
    maxAdvanceBooking: '30',
    minNotice: '2'
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Meeting title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.location === 'custom' && !formData.customLocation.trim()) {
      newErrors.customLocation = 'Custom location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const bookingLink = {
        id: Date.now().toString(),
        ...formData,
        url: `${window.location.origin}/book/${Date.now()}`,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      onSave(bookingLink);
      onClose();
      
      setFormData({
        title: '',
        description: '',
        duration: '30',
        bufferTime: '5',
        location: 'video-call',
        customLocation: '',
        availability: 'working-hours',
        maxAdvanceBooking: '30',
        minNotice: '2'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Create Booking Link</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XCircle className="h-5 w-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., 30-minute consultation"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                placeholder="Describe what this meeting is about..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Meeting Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buffer Time
                </label>
                <select
                  name="bufferTime"
                  value={formData.bufferTime}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="0">No buffer</option>
                  <option value="5">5 minutes</option>
                  <option value="10">10 minutes</option>
                  <option value="15">15 minutes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="video-call">Video Call (Google Meet)</option>
                <option value="phone-call">Phone Call</option>
                <option value="in-person">In Person</option>
                <option value="custom">Custom Location</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Booking Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Booking Link Card Component
const BookingLinkCard = ({ link, onCopy, onDelete }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy && onCopy(link);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getLocationDisplay = () => {
    switch (link.location) {
      case 'video-call': return 'Video Call';
      case 'phone-call': return 'Phone Call';
      case 'in-person': return 'In Person';
      case 'custom': return link.customLocation;
      default: return 'Not specified';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">{link.title}</h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              link.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {link.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          <p className="text-gray-600 mt-1">{link.description}</p>
          
          <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
            <span>{link.duration} min</span>
            <span>•</span>
            <span>{getLocationDisplay()}</span>
            <span>•</span>
            <span>Created {new Date(link.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <input
            type="text"
            value={link.url}
            readOnly
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
          />
          <button
            onClick={handleCopy}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm transition-colors"
          >
            {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span className="ml-1">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button 
            onClick={() => onDelete && onDelete(link)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [stats, setStats] = useState({
    totalMeetings: 0,
    upcomingMeetings: 0,
    completedMeetings: 0,
    totalHours: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingLinks, setBookingLinks] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Filter state variables
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [statusFilter, setStatusFilter] = useState('All Status');
  
  // Google Calendar Integration State
  const [calendarConnected, setCalendarConnected] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  
  // Meeting Details Modal State
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [showMeetingDetails, setShowMeetingDetails] = useState(false);

  // Google Calendar Functions
  const checkCalendarConnection = () => {
    const isConnected = googleCalendarService.getSignedInStatus();
    setCalendarConnected(isConnected);
    return isConnected;
  };

  const connectGoogleCalendar = async () => {
    setLoadingCalendar(true);
    try {
      const success = await googleCalendarService.signIn();
      if (success) {
        setCalendarConnected(true);
        await loadCalendarEvents();
      }
    } catch (error) {
      console.error('Failed to connect Google Calendar:', error);
      alert('Failed to connect Google Calendar. Please check your API credentials and try again.');
    } finally {
      setLoadingCalendar(false);
    }
  };

  const disconnectGoogleCalendar = async () => {
    try {
      await googleCalendarService.signOut();
      setCalendarConnected(false);
      setCalendarEvents([]);
      setMeetings([]);
      setStats({
        totalMeetings: 0,
        upcomingMeetings: 0,
        completedMeetings: 0,
        totalHours: 0
      });
    } catch (error) {
      console.error('Failed to disconnect Google Calendar:', error);
    }
  };

  const loadCalendarEvents = async () => {
    if (!googleCalendarService.getSignedInStatus()) {
      console.log('Not connected to Google Calendar');
      return;
    }
    
    setLoadingCalendar(true);
    try {
      // Fetch detailed events from 90 days ago to 90 days in the future
      console.log('Fetching all detailed events (past and future)...');
      
      const today = new Date();
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - 90);
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + 90);
      
      // Use the detailed fetching method
      const events = await googleCalendarService.getEventsInRangeDetailed(startDate, endDate, 200);
      console.log('Fetched detailed events:', events);
      
      setCalendarEvents(events);
      setMeetings(events);
      
      // Calculate stats with all events
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);
      
      const todaysEvents = events.filter(event => {
        const eventDate = new Date(event.start);
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEndTime = new Date();
        todayEndTime.setHours(23, 59, 59, 999);
        return eventDate >= todayStart && eventDate <= todayEndTime;
      });
      
      const upcomingEvents = events.filter(event => {
        const eventStart = new Date(event.start);
        return eventStart > todayEnd;
      });
      
      const completedEvents = events.filter(event => {
        const eventEnd = new Date(event.end);
        return eventEnd < todayEnd;
      });
      
      const totalHours = events.reduce((total, event) => {
        if (event.isAllDay) return total;
        const start = new Date(event.start);
        const end = new Date(event.end);
        const duration = (end - start) / (1000 * 60 * 60);
        return total + duration;
      }, 0);
      
      console.log('Calculated detailed stats:', {
        total: events.length,
        today: todaysEvents.length,
        upcoming: upcomingEvents.length,
        completed: completedEvents.length,
        hours: totalHours
      });
      
      setStats({
        totalMeetings: events.length,
        upcomingMeetings: upcomingEvents.length,
        completedMeetings: completedEvents.length,
        totalHours: Math.round(totalHours * 10) / 10
      });
      
    } catch (error) {
      console.error('Failed to load calendar events:', error);
      alert('Failed to load calendar events. Please try reconnecting.');
    } finally {
      setLoadingCalendar(false);
    }
  };

  // Calendar Connection Status Component
  const CalendarConnectionStatus = () => (
    <div className="flex items-center space-x-2">
      {calendarConnected ? (
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">Calendar Connected</span>
          <button
            onClick={loadCalendarEvents}
            disabled={loadingCalendar}
            className="text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
          >
            {loadingCalendar ? 'Syncing...' : 'Refresh'}
          </button>
          <button
            onClick={disconnectGoogleCalendar}
            className="text-xs text-gray-500 hover:text-red-600 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={connectGoogleCalendar}
          disabled={loadingCalendar}
          className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loadingCalendar ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Calendar className="w-4 h-4" />
          )}
          <span>{loadingCalendar ? 'Connecting...' : 'Connect Google Calendar'}</span>
        </button>
      )}
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(false);
        
        // Initialize Google Calendar API first
        try {
          await googleCalendarService.init();
          const isCalendarConnected = checkCalendarConnection();
          if (isCalendarConnected) {
            await loadCalendarEvents();
          }
        } catch (error) {
          console.error('Failed to initialize Google Calendar:', error);
        }
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchData();
      } else {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const isToday = (date) => {
    const today = new Date();
    return date && date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return date && date.toDateString() === selectedDate.toDateString();
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleSaveBookingLink = (bookingLink) => {
    setBookingLinks(prev => [...prev, bookingLink]);
  };

  const handleCopyBookingLink = (link) => {
    console.log('Booking link copied:', link.title);
  };

  const handleDeleteBookingLink = (linkToDelete) => {
    setBookingLinks(prev => prev.filter(link => link.id !== linkToDelete.id));
  };

  // Meeting Details Functions
  const handleViewMeetingDetails = async (meeting) => {
    console.log('Viewing meeting details for:', meeting);
    
    // For Google Calendar meetings, we can fetch more detailed info
    if (meeting.platform === 'google' && meeting.platformSpecific?.googleEventId) {
      try {
        const detailedMeeting = await googleCalendarService.getEventDetails(
          meeting.platformSpecific.googleEventId,
          meeting.platformSpecific.googleCalendarId || 'primary'
        );
        
        if (detailedMeeting) {
          setSelectedMeeting(detailedMeeting);
        } else {
          setSelectedMeeting(meeting);
        }
      } catch (error) {
        console.error('Failed to fetch detailed meeting info:', error);
        setSelectedMeeting(meeting);
      }
    } else {
      setSelectedMeeting(meeting);
    }
    
    setShowMeetingDetails(true);
  };

  const handleCloseMeetingDetails = () => {
    setShowMeetingDetails(false);
    setSelectedMeeting(null);
  };

  const handleEditMeeting = (meeting) => {
    // Future: Implement meeting editing
    console.log('Edit meeting:', meeting);
    if (meeting.htmlLink) {
      window.open(meeting.htmlLink, '_blank');
    }
  };

  const handleDeleteMeeting = (meeting) => {
    // Future: Implement meeting deletion
    console.log('Delete meeting:', meeting);
    if (confirm('This will open the meeting in your calendar app to delete it. Continue?')) {
      if (meeting.htmlLink) {
        window.open(meeting.htmlLink, '_blank');
      }
    }
  };

  // Filter function
  const getFilteredMeetings = () => {
    let filtered = [...meetings];
    
    // Apply time filter
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    switch (timeFilter) {
      case 'Past Meetings':
        filtered = filtered.filter(meeting => new Date(meeting.end) < now);
        break;
      case 'Upcoming Meetings':
        filtered = filtered.filter(meeting => new Date(meeting.start) > now);
        break;
      case 'Today':
        filtered = filtered.filter(meeting => {
          const meetingDate = new Date(meeting.start);
          return meetingDate >= today && meetingDate <= todayEnd;
        });
        break;
      case 'This Week':
        filtered = filtered.filter(meeting => {
          const meetingDate = new Date(meeting.start);
          return meetingDate >= startOfWeek && meetingDate <= endOfWeek;
        });
        break;
      case 'All Time':
      default:
        // No filtering needed
        break;
    }
    
    // Apply status filter
    if (statusFilter !== 'All Status') {
      filtered = filtered.filter(meeting => 
        meeting.status?.toLowerCase() === statusFilter.toLowerCase()
      );
    }
    
    return filtered;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const MeetingCard = ({ meeting }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="font-semibold text-gray-900">{meeting.title}</h3>
            {meeting.platform && (
              <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                {meeting.platform === 'google' ? '📅 Google' : meeting.platform}
              </span>
            )}
          </div>
          
          {meeting.description && (
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">{meeting.description}</p>
          )}
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {meeting.time}
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {(meeting.attendees?.length || 0) + (meeting.organizer ? 1 : 0)} attendees
            </div>
            {meeting.type === 'video' && <Video className="h-4 w-4 text-green-600" title="Video Meeting" />}
            {meeting.type === 'in-person' && <MapPin className="h-4 w-4 text-blue-600" title="In-Person Meeting" />}
            {meeting.hangoutLink && <Video className="h-4 w-4 text-green-600" title="Google Meet" />}
          </div>
          
          <div className="flex items-center mt-3 space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
              {getStatusIcon(meeting.status)}
              <span className="ml-1 capitalize">{meeting.status}</span>
            </span>
            
            {meeting.location && !meeting.hangoutLink && (
              <span className="text-xs text-gray-500 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {meeting.location.length > 30 ? meeting.location.substring(0, 30) + '...' : meeting.location}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleViewMeetingDetails(meeting)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleEditMeeting(meeting)}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Meeting"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button 
            onClick={() => handleDeleteMeeting(meeting)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Meeting"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const EmptyState = ({ icon: Icon, title, description, buttonText, onButtonClick }) => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
      {buttonText && (
        <button
          onClick={onButtonClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          {buttonText}
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Calendar className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Slotify</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search meetings..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                />
              </div>
              
              {/* Google Calendar Connection Status */}
              <CalendarConnectionStatus />
              
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg relative">
                <Bell className="h-5 w-5" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowProfile(!showProfile)}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                >
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
                    {user?.displayName || user?.email || 'User'}
                  </span>
                </button>
                
                {showProfile && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.displayName || 'User'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    <hr className="my-2" />
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <nav className="p-6">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'overview' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="h-5 w-5" />
                <span>Overview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('calendar')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'calendar' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CalendarDays className="h-5 w-5" />
                <span>Calendar</span>
              </button>
              
              <button
                onClick={() => setActiveTab('meetings')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'meetings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>Meetings</span>
              </button>
              
              <button
                onClick={() => setActiveTab('availability')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'availability' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Clock className="h-5 w-5" />
                <span>Availability</span>
              </button>
              
              <button
                onClick={() => setActiveTab('booking-links')}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeTab === 'booking-links' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LinkIcon className="h-5 w-5" />
                <span>Booking Links</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Enhanced Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setActiveTab('meetings')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    New Meeting
                  </button>
                </div>
              </div>

              {/* Interactive Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <InteractiveStatCard
                  title="Total Meetings"
                  value={stats.totalMeetings}
                  icon={Calendar}
                  color="blue"
                  trend="up"
                  change="+3 this week"
                  onClick={() => setActiveTab('meetings')}
                  quickActions={[
                    { 
                      icon: Eye, 
                      label: 'View All', 
                      onClick: () => setActiveTab('meetings') 
                    },
                    { 
                      icon: Plus, 
                      label: 'Schedule New', 
                      onClick: () => console.log('Schedule new meeting') 
                    }
                  ]}
                />
                <InteractiveStatCard
                  title="Upcoming"
                  value={stats.upcomingMeetings}
                  icon={Clock}
                  color="green"
                  trend="up"
                  change="+1 today"
                  onClick={() => {
                    setActiveTab('meetings');
                    setTimeFilter('Upcoming Meetings');
                  }}
                  quickActions={[
                    { 
                      icon: Calendar, 
                      label: 'View Schedule', 
                      onClick: () => setActiveTab('calendar') 
                    },
                    { 
                      icon: Bell, 
                      label: 'Set Reminders', 
                      onClick: () => console.log('Set reminders') 
                    }
                  ]}
                />
                <InteractiveStatCard
                  title="Completed"
                  value={stats.completedMeetings}
                  icon={CheckCircle}
                  color="purple"
                  trend="up"
                  change="+87% this month"
                  onClick={() => {
                    setActiveTab('meetings');
                    setTimeFilter('Past Meetings');
                  }}
                  quickActions={[
                    { 
                      icon: TrendingUp, 
                      label: 'View Trends', 
                      onClick: () => console.log('View trends') 
                    },
                    { 
                      icon: Download, 
                      label: 'Export Data', 
                      onClick: () => console.log('Export data') 
                    }
                  ]}
                />
                <InteractiveStatCard
                  title="Total Hours"
                  value={`${stats.totalHours}h`}
                  icon={BarChart3}
                  color="orange"
                  trend="up"
                  change="+2.3h this week"
                  onClick={() => console.log('View time analytics')}
                  quickActions={[
                    { 
                      icon: Activity, 
                      label: 'Time Analysis', 
                      onClick: () => console.log('Time analysis') 
                    },
                    { 
                      icon: Target, 
                      label: 'Set Goals', 
                      onClick: () => console.log('Set goals') 
                    }
                  ]}
                />
              </div>

              {/* Interactive Today's Meetings */}
              <InteractiveTodaysMeetings
                meetings={meetings}
                onCreateMeeting={(title) => console.log('Create meeting:', title)}
                onViewAllMeetings={() => setActiveTab('meetings')}
                calendarConnected={calendarConnected}
                onConnectCalendar={connectGoogleCalendar}
              />
            </div>
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Calendar</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors">
                  <Plus className="h-5 w-5 mr-2" />
                  Schedule Meeting
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">{formatMonth(currentDate)}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={prevMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextMonth}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                  
                  {getDaysInMonth(currentDate).map((date, index) => {
                    // Check if this date has any meetings
                    const hasEvents = date && meetings.some(meeting => {
                      const meetingDate = new Date(meeting.start);
                      return meetingDate.toDateString() === date.toDateString();
                    });

                    return (
                      <button
                        key={index}
                        onClick={() => date && setSelectedDate(date)}
                        className={`p-3 text-center text-sm hover:bg-blue-50 rounded-lg transition-colors relative ${
                          !date ? 'invisible' : ''
                        } ${
                          isToday(date) ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
                        } ${
                          isSelected(date) && !isToday(date) ? 'bg-blue-100 text-blue-600' : ''
                        }`}
                      >
                        {date ? date.getDate() : ''}
                        {hasEvents && !isToday(date) && (
                          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                            <div className="w-1 h-1 bg-blue-600 rounded-full"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Date Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </h3>
                
                {meetings.filter(meeting => {
                  const meetingDate = new Date(meeting.start);
                  return meetingDate.toDateString() === selectedDate.toDateString();
                }).length > 0 ? (
                  <div className="space-y-3">
                    {meetings
                      .filter(meeting => {
                        const meetingDate = new Date(meeting.start);
                        return meetingDate.toDateString() === selectedDate.toDateString();
                      })
                      .map(meeting => (
                        <MeetingCard key={meeting.id} meeting={meeting} />
                      ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Clock}
                    title="No meetings scheduled"
                    description="No meetings are scheduled for this date."
                    buttonText="Schedule Meeting"
                  />
                )}
              </div>
            </div>
          )}

          {/* Meetings Tab - Interactive Version */}
          {activeTab === 'meetings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">All Meetings</h2>
                <div className="flex space-x-3">
                  {/* Interactive Time Filter */}
                  <select 
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All Time">All Time</option>
                    <option value="Past Meetings">Past Meetings</option>
                    <option value="Upcoming Meetings">Upcoming Meetings</option>
                    <option value="Today">Today</option>
                    <option value="This Week">This Week</option>
                  </select>
                  
                  {/* Interactive Status Filter */}
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="All Status">All Status</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors">
                    <Plus className="h-5 w-5 mr-2" />
                    New Meeting
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6">
                  {(() => {
                    const filteredMeetings = getFilteredMeetings();
                    
                    if (filteredMeetings.length === 0) {
                      return (
                        <EmptyState
                          icon={Users}
                          title={`No meetings found`}
                          description={
                            timeFilter !== 'All Time' || statusFilter !== 'All Status'
                              ? `No meetings match your current filters: ${timeFilter}${statusFilter !== 'All Status' ? ` • ${statusFilter}` : ''}`
                              : calendarConnected 
                                ? "You haven't scheduled any meetings yet."
                                : "Connect your Google Calendar to see your meetings here."
                          }
                          buttonText={
                            (timeFilter !== 'All Time' || statusFilter !== 'All Status') 
                              ? "Clear Filters"
                              : calendarConnected 
                                ? "Create Meeting" 
                                : "Connect Google Calendar"
                          }
                          onButtonClick={() => {
                            if (timeFilter !== 'All Time' || statusFilter !== 'All Status') {
                              setTimeFilter('All Time');
                              setStatusFilter('All Status');
                            } else if (!calendarConnected) {
                              connectGoogleCalendar();
                            }
                          }}
                        />
                      );
                    }

                    // Group meetings by time categories for better organization
                    const now = new Date();
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const todayEnd = new Date();
                    todayEnd.setHours(23, 59, 59, 999);
                    
                    const upcomingMeetings = filteredMeetings.filter(meeting => 
                      new Date(meeting.start) > now
                    );
                    const pastMeetings = filteredMeetings.filter(meeting => 
                      new Date(meeting.end) < now
                    );
                    const todaysMeetings = filteredMeetings.filter(meeting => {
                      const meetingDate = new Date(meeting.start);
                      return meetingDate >= today && meetingDate <= todayEnd;
                    });

                    return (
                      <div className="space-y-6">
                        {/* Filter Results Header */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">
                              Showing {filteredMeetings.length} meeting{filteredMeetings.length !== 1 ? 's' : ''}
                            </span>
                            {(timeFilter !== 'All Time' || statusFilter !== 'All Status') && (
                              <div className="flex items-center space-x-2">
                                {timeFilter !== 'All Time' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {timeFilter}
                                    <button
                                      onClick={() => setTimeFilter('All Time')}
                                      className="ml-1 text-blue-600 hover:text-blue-800"
                                    >
                                      ×
                                    </button>
                                  </span>
                                )}
                                {statusFilter !== 'All Status' && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    {statusFilter}
                                    <button
                                      onClick={() => setStatusFilter('All Status')}
                                      className="ml-1 text-green-600 hover:text-green-800"
                                    >
                                      ×
                                    </button>
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          {(timeFilter !== 'All Time' || statusFilter !== 'All Status') && (
                            <button
                              onClick={() => {
                                setTimeFilter('All Time');
                                setStatusFilter('All Status');
                              }}
                              className="text-xs text-gray-500 hover:text-gray-700 underline"
                            >
                              Clear all filters
                            </button>
                          )}
                        </div>

                        {/* Today's Meetings - Only show if we have today's meetings and not filtering to past/upcoming specifically */}
                        {todaysMeetings.length > 0 && timeFilter !== 'Past Meetings' && timeFilter !== 'Upcoming Meetings' && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <Calendar className="h-5 w-5 mr-2 text-orange-600" />
                              Today's Meetings ({todaysMeetings.length})
                            </h3>
                            <div className="space-y-4">
                              {todaysMeetings
                                .sort((a, b) => new Date(a.start) - new Date(b.start))
                                .map((meeting) => (
                                  <MeetingCard key={`today-${meeting.id}`} meeting={meeting} />
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Upcoming Meetings */}
                        {upcomingMeetings.length > 0 && timeFilter !== 'Past Meetings' && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <Clock className="h-5 w-5 mr-2 text-blue-600" />
                              Upcoming Meetings ({upcomingMeetings.length})
                            </h3>
                            <div className="space-y-4">
                              {upcomingMeetings
                                .sort((a, b) => new Date(a.start) - new Date(b.start))
                                .map((meeting) => (
                                  <MeetingCard key={`upcoming-${meeting.id}`} meeting={meeting} />
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Past Meetings */}
                        {pastMeetings.length > 0 && timeFilter !== 'Upcoming Meetings' && timeFilter !== 'Today' && (
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                              Past Meetings ({pastMeetings.length})
                            </h3>
                            <div className="space-y-4">
                              {pastMeetings
                                .sort((a, b) => new Date(b.start) - new Date(a.start)) // Most recent first
                                .map((meeting) => (
                                  <MeetingCard key={`past-${meeting.id}`} meeting={meeting} />
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === 'availability' && (
            <SmartAvailabilitySettings calendarConnected={calendarConnected} />
          )}

          {/* Booking Links Tab */}
          {activeTab === 'booking-links' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Booking Links</h2>
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center transition-colors"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create New Link
                </button>
              </div>

              {bookingLinks.length > 0 ? (
                <div className="space-y-4">
                  {bookingLinks.map((link) => (
                    <BookingLinkCard
                      key={link.id}
                      link={link}
                      onCopy={handleCopyBookingLink}
                      onDelete={handleDeleteBookingLink}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="p-6">
                    <EmptyState
                      icon={LinkIcon}
                      title="No booking links created"
                      description="Create shareable booking links that allow others to schedule meetings with you based on your availability."
                      buttonText="Create Booking Link"
                      onButtonClick={() => setShowBookingModal(true)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Booking Link Modal */}
      <BookingLinkModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSave={handleSaveBookingLink}
      />

      {/* Meeting Details Modal */}
      <MeetingDetailsModal
        meeting={selectedMeeting}
        isOpen={showMeetingDetails}
        onClose={handleCloseMeetingDetails}
        onEdit={handleEditMeeting}
        onDelete={handleDeleteMeeting}
      />
    </div>
  );
};

export default Dashboard;