import React from 'react';

// Button Component
export const Button = ({ 
  children, 
  onClick, 
  isLoading = false, 
  variant = "primary", 
  className = "",
  type = "button",
  disabled = false,
  fullWidth = false
}) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition";
  
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    secondary: "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${isLoading || disabled ? 'opacity-70 cursor-not-allowed' : ''} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </div>
      ) : children}
    </button>
  );
};

// Input Component with floating label
export const Input = ({ 
  label, 
  id, 
  type = "text", 
  value, 
  onChange, 
  error,
  placeholder = " ",
  required = false,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border ${
          error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-600'
        } appearance-none focus:outline-none focus:ring-0 peer`}
      />
      <label
        htmlFor={id}
        className={`absolute text-sm ${
          error ? 'text-red-500' : 'text-gray-500'
        } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 peer-focus:${
          error ? 'text-red-600' : 'text-blue-600'
        }`}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

// Card Component
export const Card = ({ 
  children, 
  className = "", 
  hover = false,
  padding = "p-6"
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 ${hover ? 'card-hover' : ''} ${padding} ${className}`}>
      {children}
    </div>
  );
};

// Empty State Component
export const EmptyState = ({ 
  title, 
  description, 
  actionText, 
  onAction, 
  illustration,
  className = ""
}) => (
  <div className={`text-center py-12 px-4 ${className}`}>
    {illustration && (
      <img 
        src={illustration}
        alt="Empty state illustration" 
        className="h-40 mx-auto mb-4"
      />
    )}
    <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">{description}</p>
    {actionText && onAction && (
      <Button
        onClick={onAction}
        variant="primary"
      >
        {actionText}
      </Button>
    )}
  </div>
);

// Sidebar Component
export const Sidebar = ({ user, signOut, activePath }) => {
  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Meetings',
      path: '/meetings',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      name: 'Availability',
      path: '/create-window',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      name: 'Booking Links',
      path: '/create-link',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
        </svg>
      )
    }
  ];
  
  return (
    <aside className="fixed inset-y-0 left-0 bg-white shadow-md max-h-screen w-60 z-10">
      <div className="flex flex-col justify-between h-full">
        <div className="flex-grow">
          <div className="p-4 flex items-center justify-center border-b">
            <h1 className="text-xl font-bold text-blue-600">Slotify</h1>
          </div>
          <div className="p-4">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <a 
                    href={item.path} 
                    className={`flex items-center ${
                      activePath === item.path 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'text-gray-700 hover:bg-gray-50'
                    } rounded-md px-4 py-3 transition`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span>{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="p-4 border-t">
          <button 
            onClick={signOut} 
            className="flex items-center text-red-500 hover:text-red-700 px-4 py-2 rounded-md hover:bg-red-50 w-full transition"
          >
            <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

// Main Layout Component
export const MainLayout = ({ children, user, activePath }) => {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar user={user} signOut={handleSignOut} activePath={activePath} />
      <main className="ml-60 pt-4 px-8 max-w-7xl fade-in">{children}</main>
    </div>
  );
};

// Toast Notification Component
export const Toast = ({ 
  message, 
  type = 'success', 
  onClose,
  duration = 3000
}) => {
  const backgrounds = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };
  
  const textColors = {
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600'
  };
  
  const icons = {
    success: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  };
  
  React.useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);
  
  return (
    <div className={`fixed top-4 right-4 z-50 w-72 px-4 py-3 rounded-lg border ${backgrounds[type]} shadow-lg slide-up`}>
      <div className="flex items-center">
        <div className={textColors[type]}>
          {icons[type]}
        </div>
        <div className="ml-3 mr-8">
          <p className={`text-sm font-medium ${textColors[type]}`}>{message}</p>
        </div>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// Export all components
export default {
  Button,
  Input,
  Card,
  EmptyState,
  Sidebar,
  MainLayout,
  Toast
};