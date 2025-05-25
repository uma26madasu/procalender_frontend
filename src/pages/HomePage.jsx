import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    console.log('Going to signup');
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Slotify Test Page</h1>
        <button 
          onClick={handleSignup}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
        >
          Test Signup Button
        </button>
      </div>
    </div>
  );
};

export default HomePage;