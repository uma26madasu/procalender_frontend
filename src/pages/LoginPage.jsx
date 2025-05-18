import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, signInWithGooglePopup } from '../firebase';

// Slotify logo component
const SlotifyLogo = () => (
  <div className="text-indigo-600">
    <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="6" width="18" height="15" rx="2" fill="currentColor" />
      <rect x="5" y="8" width="14" height="11" rx="1" fill="white" />
      <rect x="7" y="3" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="15" y="3" width="2" height="4" rx="1" fill="currentColor" />
      <rect x="7" y="10" width="10" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="7" y="14" width="6" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  </div>
);

// Features data for the sidebar
const features = [
  {
    id: 1,
    title: "Smart Scheduling",
    description: "Automatically find the perfect time slots for your meetings",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    id: 2,
    title: "Time Zone Intelligence",
    description: "Schedule across time zones without confusion",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    id: 3,
    title: "Client Self-Booking",
    description: "Let clients book their own appointments through customizable links",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
      </svg>
    )
  },
  {
    id: 4,
    title: "Calendar Integration",
    description: "Sync with your favorite calendar apps for seamless scheduling",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  }
];

const LoginPage = ({ initialSignUp = false }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(initialSignUp);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  // Set isSignUp based on URL path if it changes
  useEffect(() => {
    setIsSignUp(location.pathname === '/signup');
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      if (isSignUp) {
        // Validate password match
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        // Validate name for signup
        if (!name.trim()) {
          throw new Error('Name is required');
        }
        
        // Create user
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Update profile with name
        await updateProfile(userCredential.user, {
          displayName: name
        });
      } else {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Authentication error:', err);
      
      // Handle specific Firebase errors with user-friendly messages
      if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Incorrect email or password. Please try again.');
      } else if (err.code === 'auth/weak-password') {
        setError('Please use a stronger password (at least 6 characters).');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setIsLoading(true);
    setError('');
    
    try {
      if (provider === 'Google') {
        await signInWithGooglePopup();
        navigate('/dashboard');
      } else if (provider === 'GitHub') {
        // Replace with your GitHub auth method if needed
        console.log('GitHub login - implement your method here');
      } else if (provider === 'LinkedIn') {
        // Replace with your LinkedIn auth method if needed
        console.log('LinkedIn login - implement your method here');
      }
    } catch (err) {
      console.error(`${provider} sign-in error:`, err);
      setError(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between signup and login
  const toggleSignUp = () => {
    const newIsSignUp = !isSignUp;
    setIsSignUp(newIsSignUp);
    navigate(newIsSignUp ? '/signup' : '/login', { replace: true });
    // Clear form errors when switching
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-gray-50">
      {/* Left side - Features & Branding */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
        <div className="max-w-xl mx-auto px-8 py-12 flex flex-col justify-center">
          {/* Logo and brand name */}
          <div className="flex items-center space-x-3 mb-16">
            <SlotifyLogo />
            <h1 className="text-3xl font-bold">Slotify</h1>
          </div>
          
          {/* Main Headline */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Scheduling Made Simple</h2>
            <p className="text-xl text-indigo-100">Save time with effortless appointment booking</p>
          </div>
          
          {/* Features */}
          <div className="space-y-8">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-start space-x-4">
                <div className="bg-indigo-500 bg-opacity-30 rounded-lg p-2">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-indigo-100 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right side - Login/Signup Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="md:hidden flex flex-col items-center mb-10">
            <SlotifyLogo />
            <h1 className="text-3xl font-bold text-indigo-600 mt-2">Slotify</h1>
            <p className="text-gray-500 mt-1">Scheduling made simple</p>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSignUp 
                ? 'Start scheduling meetings in minutes' 
                : 'Sign in to continue to your account'}
            </p>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm animate-shake">
              <div className="flex">
                <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          {/* Social login buttons */}
          <div className="mb-6">
            <button 
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 text-gray-700 font-medium"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
              </svg>
              Continue with Google
            </button>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isSignUp}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="John Smith"
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {!isSignUp && (
                  <a href="#" className="text-xs font-medium text-indigo-600 hover:text-indigo-500">
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            
            {isSignUp && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required={isSignUp}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}
            
            {!isSignUp && (
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </>
                ) : (
                  isSignUp ? 'Create account' : 'Sign in'
                )}
              </button>
            </div>
          </form>
          
          {/* Sign up/in toggle link */}
          <div className="mt-8 text-center">
            <button 
              type="button" 
              onClick={toggleSignUp}
              disabled={isLoading}
              className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
        
        <div className="mt-10 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Slotify. All rights reserved.</p>
          <p className="mt-1">
            <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a>
            {' • '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;