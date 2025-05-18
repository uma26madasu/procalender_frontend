// src/components/SlotifyLogo.jsx
import React from 'react';

const SlotifyLogo = ({ className = '', size = 32 }) => {
  return (
    <div className={`text-white inline-flex ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Calendar base shape */}
        <rect 
          x="2" 
          y="6" 
          width="28" 
          height="22" 
          rx="3" 
          className="fill-current" 
        />
        
        {/* Calendar top bar */}
        <rect 
          x="4" 
          y="2" 
          width="24" 
          height="6" 
          rx="2" 
          className="fill-current" 
          opacity="0.7" 
        />
        
        {/* Calendar time slots */}
        <rect x="6" y="12" width="8" height="2" rx="1" fill="white" />
        <rect x="18" y="12" width="8" height="2" rx="1" fill="white" />
        <rect x="6" y="16" width="8" height="2" rx="1" fill="white" />
        <rect x="18" y="16" width="8" height="2" rx="1" fill="white" />
        <rect x="6" y="20" width="8" height="2" rx="1" fill="white" />
        <rect x="18" y="20" width="8" height="2" rx="1" fill="white" />
        
        {/* Clock hands representing time selection */}
        <circle cx="16" cy="22" r="5" fill="white" opacity="0.9" />
        <rect x="15.5" y="18" width="1" height="4" rx="0.5" fill="currentColor" />
        <rect x="15.5" y="21.5" width="1" height="3" rx="0.5" transform="rotate(-45 15.5 21.5)" fill="currentColor" />
      </svg>
    </div>
  );
};

export default SlotifyLogo;