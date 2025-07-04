import React from 'react';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputClasses = `
    mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm
    ${error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
    }
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
    ${className}
  `;

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Input;
