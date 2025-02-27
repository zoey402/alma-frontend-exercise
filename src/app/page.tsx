'use client';

import React, { useState } from 'react';
import SubmissionConfirmation from '@/components/lead/SubmissionConfirmation';
import LeadForm from '@/components/lead/LeadForm';

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
  };
  
  const handleReset = () => {
    setIsSubmitted(false);
  };
  
  // Confirmation screen after successful submission
  if (isSubmitted) {
    return <SubmissionConfirmation onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Header Section */}
      <div className="w-full">
        <div className="container bg-accent w-full px-4 py-16 max-w-8xl mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Logo */}
            <div className="mb-12">
              <div className="font-bold text-2xl text-primary">
                almă
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-5xl font-bold text-primary">
              Get An Assessment<br />
              Of Your Immigration Case
            </h1>
          </div>
        </div>
          
        <div className="flex justify-center items-center px-10 py-10 w-full">
          <div className="bg-white rounded-lg p-8 md:p-10 w-full max-w-2xl">
            <LeadForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}