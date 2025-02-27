import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Checkbox from '@/components/ui/CheckBox';
import FileUpload from '@/components/ui/FileUpload';
import Textarea from '@/components/ui/Textarea';
import { leadFormSchema, LeadFormSchemaType } from '@/schemas/leadFormSchema';
import { countryOptions, visaOptions } from '@/constants/formData';

interface LeadFormProps {
  onSubmitSuccess: () => void;
}

const LeadForm: React.FC<LeadFormProps> = ({ onSubmitSuccess }) => {
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormSchemaType>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      linkedin: '',
      countryOfCitizenship: '',
      interestedVisas: [],
      resume: null,
      openInput: '',
    },
  });

  const onSubmit = async (data: LeadFormSchemaType) => {
    try {
      setSubmissionError(null);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('email', data.email);
      formData.append('linkedin', data.linkedin);
      formData.append('countryOfCitizenship', data.countryOfCitizenship);
      data.interestedVisas.forEach((visa) => {
        formData.append('interestedVisas', visa);
      });
      if (data.resume) {
        formData.append('resume', data.resume);
      }
      formData.append('openInput', data.openInput || '');

      // Send form data to API
      const response = await fetch('/api/leads', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }
      
      // Reset form and call success callback
      reset();
      onSubmitSuccess();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmissionError(
        error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred. Please try again.'
      );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold mb-2">Want to understand your visa options?</h2>
        <p className="text-text-secondary mb-8 max-w-md mx-auto">
          Submit the form below and our team of experienced attorneys will review your 
          information and send a preliminary assessment of your case based on your goals.
        </p>
      </div>

      {submissionError && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-md p-4 text-sm">
          {submissionError}
        </div>
      )}
      
      {/* Personal Information */}
      <div className="space-y-4 max-w-md mx-auto">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <Input
              id="firstName"
              placeholder="First Name"
              error={errors.firstName?.message}
              {...field}
            />
          )}
        />
        
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <Input
              id="lastName"
              placeholder="Last Name"
              error={errors.lastName?.message}
              {...field}
            />
          )}
        />
        
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              id="email"
              type="email"
              placeholder="Email"
              error={errors.email?.message}
              {...field}
            />
          )}
        />
        
        <Controller
          name="countryOfCitizenship"
          control={control}
          render={({ field }) => (
            <Select
              id="countryOfCitizenship"
              options={countryOptions}
              error={errors.countryOfCitizenship?.message}
              {...field}
            />
          )}
        />

        <Controller
          name="linkedin"
          control={control}
          render={({ field }) => (
            <Input
              id="linkedin"
              placeholder="LinkedIn / Personal Website URL"
              error={errors.linkedin?.message}
              {...field}
            />
          )}
        />
      </div>
      
      {/* Visa Categories */}
      <div className="mt-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-icon p-3">
            <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-4">Visa categories of interest?</h3>
        
        <Controller
          name="interestedVisas"
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="space-y-2 inline-block text-left max-w-md mx-auto">
              {visaOptions.map((option) => (
                <Checkbox
                  key={option.value}
                  id={`visa-${option.value}`}
                  label={option.label}
                  checked={value.includes(option.value)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const newValue = checked
                      ? [...value, option.value]
                      : value.filter((v) => v !== option.value);
                    onChange(newValue);
                  }}
                />
              ))}
              {errors.interestedVisas && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.interestedVisas.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
      
      {/* Resume Upload */}
      <div className="mt-8 text-center">
        <div className="flex justify-center mb-4">
            <div className="rounded-full bg-icon p-3">
            <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            </div>
        </div>
        <h3 className="text-lg font-semibold mb-4">Upload Resume / CV</h3>
        <div className="max-w-md mx-auto">
          <Controller
            name="resume"
            control={control}
            render={({ field: { onChange } }) => (
              <FileUpload
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={onChange}
                error={errors.resume?.message}
              />
            )}
          />
        </div>
      </div>
      
      {/* Open Input */}
      <div className="mt-8 text-center">
        <div className="flex justify-center mb-4">
            <div className="rounded-full bg-icon p-3">
            <svg className="h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            </div>
        </div>
        <h3 className="text-lg font-semibold mb-4">How can we help you?</h3>
        <div className="max-w-md mx-auto">
          <Controller
            name="openInput"
            control={control}
            render={({ field }) => (
              <Textarea
                id="openInput"
                placeholder="What is your current status and where are you now? What is your past immigration history? Are you interested in permanent residency or a temporary visa? Tell us more about your goals and any timeline considerations."
                rows={6}
                {...field}
              />
            )}
          />
        </div>
      </div>
      
      <div className="mt-8 max-w-md mx-auto">
        <Button
          type="submit"
          fullWidth
          isLoading={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;