import React, { forwardRef, useState, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface FileUploadProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  accept?: string;
  onChange?: (file: File | null) => void;
}

const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(({
  label,
  error,
  helperText,
  fullWidth = true,
  className,
  accept = '.pdf,.doc,.docx',
  onChange,
  ...props
}, ref) => {
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Base container styles
  const baseContainerStyles = 'flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md transition-colors';
  
  // Error and dragging state styles
  const stateStyles = error 
    ? 'border-red-500 bg-red-50' 
    : isDragging 
      ? 'border-accent bg-accent-light' 
      : 'border-input-border bg-white hover:bg-gray-50';
  
  // Width styles
  const widthStyles = fullWidth ? 'w-full' : '';
  
  // Combine all container styles
  const containerStyles = twMerge(
    baseContainerStyles,
    stateStyles,
    widthStyles,
    className
  );
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setFileName(file.name);
      onChange?.(file);
    } else {
      setFileName('');
      onChange?.(null);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      // Update the input element's files
      if (fileInputRef.current) {
        // This is a hack to set files to the input element
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
      
      setFileName(file.name);
      onChange?.(file);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-text-primary mb-1">
          {label}
        </label>
      )}
      
      <div
        className={containerStyles}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={(node) => {
            // Handle both the forwarded ref and the local ref
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            fileInputRef.current = node;
          }}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
          {...props}
        />
        
        <svg className="h-10 w-10 text-text-secondary mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        
        {fileName ? (
          <div className="mt-2 text-sm text-text-primary">
            <p className="font-medium">{fileName}</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-text-primary">
              <span className="font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-text-secondary mt-1">
              {accept.split(',').join(', ')}
            </p>
          </>
        )}
      </div>
      
      {error && (
        <p id={props.id ? `${props.id}-error` : undefined} className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p id={props.id ? `${props.id}-helper` : undefined} className="mt-1 text-sm text-text-secondary">
          {helperText}
        </p>
      )}
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

export default FileUpload;