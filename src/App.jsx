import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';

// Simple fallback component for missing pages
const ComingSoon = ({ pageName }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{pageName}</h1>
      <p className="text-gray-600 mb-8">This page is coming soon!</p>
      <button 
        onClick={() => window.location.href = '/'}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Back to Home
      </button>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signup" element={<ComingSoon pageName="Sign Up" />} />
      <Route path="/login" element={<ComingSoon pageName="Login" />} />
      <Route path="/dashboard" element={<ComingSoon pageName="Dashboard" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;