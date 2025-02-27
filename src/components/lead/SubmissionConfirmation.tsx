import React from 'react';
import Button from '@/components/ui/Button';

interface SubmissionConfirmationProps {
  onReset: () => void;
}

const SubmissionConfirmation: React.FC<SubmissionConfirmationProps> = ({ onReset }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-accent-light p-6">
            <svg className="h-12 w-12 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Thank You</h1>
        <p className="text-text-secondary mb-6">
          Your information was submitted to our team of immigration attorneys. 
          Expect an email from hello@tryalma.ai.
        </p>
        <Button 
          fullWidth 
          onClick={onReset}
        >
          Go Back to Homepage
        </Button>
      </div>
    </div>
  );
};

export default SubmissionConfirmation;