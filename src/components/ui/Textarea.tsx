import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  error,
  className = '',
  rows = 4,
  ...props
}, ref) => {

  const baseStyles = 'w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent';
  
  const errorStyles = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-input-border';

  const textareaStyles = [
    baseStyles,
    errorStyles,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="w-full">
      <textarea
        ref={ref}
        className={textareaStyles}
        rows={rows}
        aria-invalid={!!error}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;