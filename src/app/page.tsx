'use client';

import React, { useState } from 'react';
import SubmissionConfirmation from '@/components/lead/SubmissionConfirmation';
import LeadForm from '@/components/lead/LeadForm';
import FormHeader from '@/components/lead/FormHeader';

export default function Home() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const handleSubmitSuccess = () => {
    setIsSubmitted(true);
  };
  
  const handleReset = () => {
    setIsSubmitted(false);
  };

  const CircleDecoration = ({ className }: { className: string }) => (
    <div className={`absolute rounded-full ${className}`}></div>
  );
  
  // Confirmation screen after successful submission
  if (isSubmitted) {
    return <SubmissionConfirmation onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-accent-light relative overflow-hidden">
      {/* Decorative circles */}
      <CircleDecoration className="w-40 h-40 bg-accent opacity-20 -top-10 -left-10" />
      <CircleDecoration className="w-64 h-64 bg-accent opacity-10 -bottom-20 -right-20" />
      <CircleDecoration className="w-32 h-32 bg-accent opacity-15 top-1/3 -right-10" />
      
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-10">
            <div className="font-bold text-2xl text-primary">
              almă
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-card p-8 md:p-10">
            <FormHeader />
            <LeadForm onSubmitSuccess={handleSubmitSuccess} />
          </div>
        </div>
      </div>
    </div>
  );
}