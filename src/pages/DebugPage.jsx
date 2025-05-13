import { useState, useEffect } from 'react';

export default function DebugPage() {
  const [envVars, setEnvVars] = useState({});
  const [firebaseStatus, setFirebaseStatus] = useState('Checking...');
  const [backendStatus, setBackendStatus] = useState('Checking...');
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Check environment variables
    const environmentVars = {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY ? '******' : undefined,
      VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
      VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    };
    setEnvVars(environmentVars);

    // Check Firebase
    import('../firebase')
      .then((firebase) => {
        if (firebase.auth) {
          setFirebaseStatus('Firebase initialized');
        } else {
          setFirebaseStatus('Firebase auth not available');
        }
      })
      .catch((error) => {
        setFirebaseStatus(`Firebase error: ${error.message}`);
        setErrors((prev) => [...prev, `Firebase: ${error.message}`]);
      });

    // Check backend
    const apiUrl = import.meta.env.VITE_API_URL || 'https://procalender-backend.onrender.com';
    fetch(`${apiUrl}/api/test`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`API responded with status ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setBackendStatus(`Backend connected: ${JSON.stringify(data)}`);
      })
      .catch((error) => {
        setBackendStatus(`Backend error: ${error.message}`);
        setErrors((prev) => [...prev, `Backend: ${error.message}`]);
      });
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Application Debug Information</h1>
      
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
        <pre className="bg-gray-100 p-3 rounded overflow-auto">
          {JSON.stringify(envVars, null, 2)}
        </pre>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Firebase Status</h2>
          <p className={firebaseStatus.includes('error') ? 'text-red-600' : 'text-green-600'}>
            {firebaseStatus}
          </p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Backend Status</h2>
          <p className={backendStatus.includes('error') ? 'text-red-600' : 'text-green-600'}>
            {backendStatus}
          </p>
        </div>
      </div>
      
      {errors.length > 0 && (
        <div className="p-4 bg-red-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Errors</h2>
          <ul className="list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index} className="text-red-600">{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <div className="mt-6 flex space-x-4">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Refresh Page
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}