import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  error,
  className = '',
  ...props
}, ref) => {
  // basic style
  const baseStyles = 'w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent';
  
  // error style
  const errorStyles = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-input-border';
  
  const inputStyles = [
    baseStyles,
    errorStyles,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="w-full">
      <input
        ref={ref}
        className={inputStyles}
        aria-invalid={!!error}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;