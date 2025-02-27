import React, { forwardRef } from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  ...props
}, ref) => {
  return (
    <div className="flex items-start mb-2">
      <div className="flex items-center h-5">
        <input
          ref={ref}
          type="checkbox"
          className="h-4 w-4 rounded border-input-border text-accent focus:ring-accent"
          {...props}
        />
      </div>
      <div className="ml-3 text-sm">
        <label className="font-medium text-text-primary">
          {label}
        </label>
      </div>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;