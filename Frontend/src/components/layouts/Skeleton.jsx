import React from 'react';

const Skeleton = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-blue-100/50 dark:bg-blue-200 rounded ${className}`}
    />
  );
};

export default Skeleton;
