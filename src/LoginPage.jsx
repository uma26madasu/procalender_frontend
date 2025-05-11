
import React from 'react';

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = '/auth/google';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;
