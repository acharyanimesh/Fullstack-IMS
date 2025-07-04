import React from 'react';

const Loading = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false,
  className = '' 
}) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const spinner = (
    <div className={`animate-spin rounded-full border-b-2 border-indigo-600 ${sizes[size]}`}></div>
  );

  const content = (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      {spinner}
      {text && <p className="text-gray-600 text-sm">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
