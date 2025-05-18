import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGoogle } from '../firebase';
import { Github, Linkedin } from 'lucide-react';

const LoginPage = ({ initialSignUp = false }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
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
        await signInWithGoogle();
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

  // Update URL when toggling between signup and login
  const toggleSignUp = () => {
    const newIsSignUp = !isSignUp;
    setIsSignUp(newIsSignUp);
    navigate(newIsSignUp ? '/signup' : '/login', { replace: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {/* Logo and title */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <div className="h-8 w-8 bg-blue-600 rounded-md mr-2"></div>
          <h1 className="text-2xl font-bold">ProCalender</h1>
        </div>
        <p className="text-gray-600">Manage your schedule efficiently</p>
      </div>
      
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isSignUp ? 'Create an account' : 'Sign in to ProCalender'}
        </h2>

        {/* Error message if any */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 text-sm rounded-md">
            {error}
          </div>
        )}
        
        {/* Social logins */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button 
            onClick={() => handleSocialLogin('GitHub')}
            disabled={isLoading}
            className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Github size={20} />
          </button>
          <button 
            onClick={() => handleSocialLogin('LinkedIn')}
            disabled={isLoading}
            className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Linkedin size={20} color="#0A66C2" />
          </button>
          <button 
            onClick={() => handleSocialLogin('Google')}
            disabled={isLoading}
            className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          </button>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or continue with</span>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="your@email.com"
              required
              disabled={isLoading}
            />
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              disabled={isLoading}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleSignUp}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
            disabled={isLoading}
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Don\'t have an account? Sign up'}
          </button>
        </div>
      </div>
      
      <div className="mt-6 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} ProCalender. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LoginPage;