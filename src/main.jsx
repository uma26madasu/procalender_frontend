import React, { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, useLocation } from 'react-router-dom'
import App from './App'
import './index.css'

console.log('Application starting...');

// Create ErrorBoundary component inline
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '20px', textAlign: 'center'}}>
          <h1 style={{color: 'red'}}>Something went wrong</h1>
          <p>{this.state.error?.message || 'Unknown error'}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: 'blue',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const RouterDebugger = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route changed to:', location.pathname);
  }, [location]);

  return null;
}

// Wrap rendering in a try-catch block
try {
  console.log('Starting to render application...');
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter basename="/">
          <RouterDebugger />
          <App />
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
  
  console.log('Application rendered successfully');
} catch (error) {
  console.error('Fatal application error:', error);
  
  // Show error directly in DOM if rendering fails
  document.getElementById('root').innerHTML = `
    <div style="padding: 20px; text-align: center; font-family: sans-serif;">
      <h1 style="color: red;">Application Failed to Load</h1>
      <p>${error.message}</p>
      <button onclick="window.location.reload()" style="padding: 8px 16px; background-color: blue; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 20px">
        Refresh Page
      </button>
    </div>
  `;
}