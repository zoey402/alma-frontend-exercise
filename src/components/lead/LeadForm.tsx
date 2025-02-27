import React from 'react';
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
      
      // Mark as submitted and reset form
      onSubmitSuccess();
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      // Here you would handle errors, e.g. show a toast notification
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className="form-label">First Name</label>
          <Controller
            name="firstName"
            control={control}
            render={({ field }) => (
              <Input
                id="firstName"
                placeholder="Enter your first name"
                error={errors.firstName?.message}
                {...field}
              />
            )}
          />
        </div>
        
        <div>
          <label htmlFor="lastName" className="form-label">Last Name</label>
          <Controller
            name="lastName"
            control={control}
            render={({ field }) => (
              <Input
                id="lastName"
                placeholder="Enter your last name"
                error={errors.lastName?.message}
                {...field}
              />
            )}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="email" className="form-label">Email</label>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              error={errors.email?.message}
              {...field}
            />
          )}
        />
      </div>
      
      <div>
        <label htmlFor="linkedin" className="form-label">LinkedIn / Personal Website URL</label>
        <Controller
          name="linkedin"
          control={control}
          render={({ field }) => (
            <Input
              id="linkedin"
              placeholder="https://linkedin.com/in/your-profile"
              error={errors.linkedin?.message}
              {...field}
            />
          )}
        />
      </div>
      
      <div>
        <label htmlFor="countryOfCitizenship" className="form-label">Country of Citizenship</label>
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
      </div>
      
      {/* Visa Categories */}
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <div className="rounded-full bg-accent-light p-3 mr-3">
            <svg className="h-6 w-6 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">Visa categories of interest?</h3>
        </div>
        
        <div className="ml-4">
            <Controller
              name="interestedVisas"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="space-y-2">
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
      </div>
      
      {/* Resume Upload */}
      <div>
        <label htmlFor="resume" className="form-label">Upload Resume / CV</label>
        <Controller
          name="resume"
          control={control}
          render={({ field: { onChange } }) => (
            <FileUpload
              id="resume"
              accept=".pdf,.doc,.docx"
              onChange={onChange}
              error={errors.resume?.message}
              helperText="Please upload your resume in PDF, DOC, or DOCX format"
            />
          )}
        />
      </div>
      
      {/* Open Input */}
      <div className="mt-8">
        <div className="flex items-center mb-4">
          <div className="rounded-full bg-accent-light p-3 mr-3">
            <svg className="h-6 w-6 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold">How can we help you?</h3>
        </div>
        
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
      
      <div className="mt-8">
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