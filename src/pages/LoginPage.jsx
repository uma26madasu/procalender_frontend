import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import logo from '/logo.svg'; // Standard SVG import

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDngn-nNfWDWGjXcDdtO6GiM5xOBQvYil8",
  authDomain: "pro-calender-uma".firebaseapp.com,
  projectId: "pro-calender-uma",
  // Add other configs from Firebase Console
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Form Validation Schema
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data) => {
    console.log('Login data:', data);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: result.user.accessToken }),
      });

      if (response.ok) {
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Google login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md w-80">
        <img src={logo} alt="ProCalendar Logo" className="w-32 mx-auto mb-6" />
        
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome to ProCalendar
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Schedule smarter, not harder.
        </p>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200 mb-4"
          >
            Login
          </button>
        </form>

        <div className="text-center text-sm text-gray-600 mb-4">OR</div>
        
        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 w-full bg-white border border-gray-300 hover:bg-gray-50 py-2 px-4 rounded-md transition duration-200 mb-4"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            alt="Google" 
            className="w-4 h-4" 
          />
          Continue with Google
        </button>

        <Link 
          to="/dashboard" 
          className="block text-center text-blue-500 hover:underline"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}