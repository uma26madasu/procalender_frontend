import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { auth, googleProvider } from '../firebase'; // Import from centralized config
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import logo from '/logo.svg';

// Form Validation Schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleEmailLogin = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      alert(`Login failed: ${error.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Google login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-full max-w-md">
        <img src={logo} alt="ProCalendar Logo" className="w-32 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome to ProCalendar
        </h1>
        
        <form onSubmit={handleSubmit(handleEmailLogin)} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-blue-600 text-white py-2 px-4 rounded-md transition ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="my-4 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md transition"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-4 h-4" 
          />
          Continue with Google
        </button>

        <div className="mt-6 text-center">
          <Link 
            to="/forgot-password" 
            className="text-blue-500 hover:underline text-sm"
          >
            Forgot password?
          </Link>
          <span className="mx-2 text-gray-400">•</span>
          <Link 
            to="/signup" 
            className="text-blue-500 hover:underline text-sm"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}