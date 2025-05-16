import React from 'react';
import { Link } from 'react-router-dom';

export function Button({ 
  children, 
  type = "button", 
  variant = "primary", 
  size = "md", 
  className = "", 
  disabled = false,
  loading = false,
  onClick,
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border border-transparent focus:ring-blue-500",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-blue-500",
    success: "bg-green-600 hover:bg-green-700 text-white border border-transparent focus:ring-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white border border-transparent focus:ring-red-500",
  };
  
  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  const disabledStyles = disabled || loading ? "opacity-50 cursor-not-allowed" : "";
  
  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`;
  
  return (
    <button
      type={type}
      className={buttonStyles}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  to,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none";
  
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border border-transparent",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300",
    success: "bg-green-600 hover:bg-green-700 text-white border border-transparent",
    danger: "bg-red-600 hover:bg-red-700 text-white border border-transparent",
  };
  
  const sizeStyles = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  const linkStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;
  
  return (
    <Link
      to={to}
      className={linkStyles}
      {...props}
    >
      {children}
    </Link>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action }) {
  return (
    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}

export function CardBody({ children, className = "" }) {
  return (
    <div className={`px-4 py-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = "" }) {
  return (
    <div className={`px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
}

export function Alert({ title, children, type = "info", dismissible, onDismiss }) {
  const typeStyles = {
    info: "bg-blue-50 text-blue-700",
    success: "bg-green-50 text-green-700",
    warning: "bg-yellow-50 text-yellow-700",
    error: "bg-red-50 text-red-700",
  };
  
  return (
    <div className={`rounded-md p-4 ${typeStyles[type]}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          {type === "info" && (
            <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
            </svg>
          )}
          {type === "success" && (
            <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          {type === "warning" && (
            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {type === "error" && (
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className="text-sm mt-2">
            {children}
          </div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === "info" ? "bg-blue-50 text-blue-500 hover:bg-blue-100 focus:ring-blue-600" :
                  type === "success" ? "bg-green-50 text-green-500 hover:bg-green-100 focus:ring-green-600" :
                  type === "warning" ? "bg-yellow-50 text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600" :
                  "bg-red-50 text-red-500 hover:bg-red-100 focus:ring-red-600"
                }`}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function FormGroup({ label, htmlFor, error, children, className = "" }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export function Input({
  type = "text",
  id,
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
  error,
  ...props
}) {
  const inputClasses = `block w-full px-3 py-2 border ${
    error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${className}`;

  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={inputClasses}
      {...props}
    />
  );
}

export function TextArea({
  id,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  disabled = false,
  className = "",
  error,
  ...props
}) {
  const textareaClasses = `block w-full px-3 py-2 border ${
    error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${className}`;

  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={textareaClasses}
      {...props}
    />
  );
}

export function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
  className = "",
  error,
  ...props
}) {
  const selectClasses = `block w-full pl-3 pr-10 py-2 text-base border ${
    error ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
  } rounded-md shadow-sm focus:outline-none sm:text-sm ${className}`;

  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={selectClasses}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function Badge({
  children,
  color = "gray",
  className = "",
  ...props
}) {
  const colorClasses = {
    gray: "bg-gray-100 text-gray-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    green: "bg-green-100 text-green-800",
    blue: "bg-blue-100 text-blue-800",
    indigo: "bg-indigo-100 text-indigo-800",
    purple: "bg-purple-100 text-purple-800",
    pink: "bg-pink-100 text-pink-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[color]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}