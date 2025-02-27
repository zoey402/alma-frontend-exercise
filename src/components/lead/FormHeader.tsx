import React from 'react';

const FormHeader: React.FC = () => {
  return (
    <>
      <h1 className="text-3xl font-bold mb-2">
        Get An Assessment<br />
        Of Your Immigration Case
      </h1>
      
      <div className="flex flex-col md:flex-row items-center mb-8 mt-8">
        <div className="mr-4 mb-4 md:mb-0">
          <div className="rounded-full bg-accent-light p-3">
            <svg className="h-8 w-8 text-accent" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-1">Want to understand your visa options?</h2>
          <p className="text-text-secondary">
            Submit the form below and our team of experienced attorneys will review your 
            information and send a preliminary assessment of your case based on your goals.
          </p>
        </div>
      </div>
    </>
  );
};

export default FormHeader;