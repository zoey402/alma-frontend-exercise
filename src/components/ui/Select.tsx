import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  error?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  options,
  error,
  className = '',
  ...props
}, ref) => {
  // basic style
  const baseStyles = 'w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent appearance-none bg-white';
  
  // error style
  const errorStyles = error 
    ? 'border-red-500 focus:ring-red-500' 
    : 'border-input-border';
  
  const selectStyles = [
    baseStyles,
    errorStyles,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className="w-full">
      <div className="relative">
        <select
          ref={ref}
          className={selectStyles}
          aria-invalid={!!error}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg className="h-5 w-5 text-text-secondary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;