import React from 'react';

const Loading: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent"></div>
        <p className="mt-2 text-text-secondary">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;