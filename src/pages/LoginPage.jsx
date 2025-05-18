// src/pages/LoginPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, signInWithGooglePopup } from '../firebase';

// Import the SlotifyLogo component
import SlotifyLogo from '../components/SlotifyLogo.jsx';

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
      setError(err.message || 'Authentication failed');
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
        // Replace with your GitHub auth method
        console.log('GitHub login - implement your method here');
      } else if (provider === 'LinkedIn') {
        // Replace with your LinkedIn auth method
        console.log('LinkedIn login - implement your method here');
      }
    } catch (err) {
      setError(err.message || `Failed to sign in with ${provider}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between signup and login
  const toggleSignUp = () => {
    const newIsSignUp = !isSignUp;
    setIsSignUp(newIsSignUp);
    navigate(newIsSignUp ? '/signup' : '/login', { replace: true });
  };

  // Features list for the left side
  const features = [
    {
      id: 1,
      title: "Smart Scheduling",
      description: "Intelligent time slot suggestions based on availability patterns",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Calendar Integrations",
      description: "Seamlessly connect with Google, Outlook, and other calendar providers",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Custom Booking Pages",
      description: "Create personalized booking pages that match your brand",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      id: 4,
      title: "Automated Reminders",
      description: "Send automated notifications to reduce no-shows",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Left side - Features & Animations */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-blue-400 p-12 text-white">
        <div className="max-w-md mx-auto space-y-16">
          {/* Logo and brand name */}
          <div className="flex items-center space-x-3 animate-fadeIn">
            <SlotifyLogo />
            <h1 className="text-3xl font-bold tracking-tight">Slotify</h1>
          </div>
          
          {/* Tagline */}
          <div className="animate-slideInFromLeft" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-semibold mb-2">Scheduling made simple</h2>
            <p className="text-blue-100">Book meetings without the back-and-forth</p>
          </div>
          
          {/* Features */}
          <div className="space-y-8">
            {features.map((feature, index) => (
              <div 
                key={feature.id} 
                className="flex items-start space-x-4 animate-slideInFromLeft" 
                style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              >
                <div className="bg-white/20 p-2 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{feature.title}</h3>
                  <p className="text-blue-100 text-sm mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Right side - Login/Signup Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 animate-fadeIn">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile logo */}
          <div className="flex items-center justify-center lg:hidden mb-10 space-x-3">
            <SlotifyLogo />
            <h1 className="text-3xl font-bold text-blue-600 tracking-tight">Slotify</h1>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="mt-2 text-gray-600">
              {isSignUp 
                ? 'Start scheduling meetings in minutes' 
                : 'Sign in to your account to continue'}
            </p>
          </div>
          
          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-md text-red-600 text-sm animate-shake">
              {error}
            </div>
          )}
          
          {/* Social login buttons */}
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => handleSocialLogin('Google')}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
              </svg>
            </button>
            <button 
              onClick={() => handleSocialLogin('GitHub')}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
            </button>
            <button 
              onClick={() => handleSocialLogin('LinkedIn')}
              disabled={isLoading}
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="#0A66C2" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </button>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                {!isSignUp && (
                  <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">
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
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            )}
            
            {!isSignUp && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
              </div>
            )}
            
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isSignUp ? 'Creating account...' : 'Signing in...'}
                  </div>
                ) : (
                  isSignUp ? 'Create account' : 'Sign in'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-4 text-center">
            <button 
              type="button" 
              onClick={toggleSignUp}
              disabled={isLoading}
              className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Slotify. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;