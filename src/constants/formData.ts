import { InterestedVisa } from '@/types/lead';

// Country options for dropdown
export const countryOptions = [
  { value: '', label: 'Country of Citizenship' },
  { value: 'mexico', label: 'Mexico' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'russia', label: 'Russia' },
  { value: 'south-korea', label: 'South Korea' },
  { value: 'france', label: 'France' },
  { value: 'china', label: 'China' },
  { value: 'india', label: 'India' },
  // Add more countries as needed
];

// Visa options for checkboxes
export const visaOptions = [
  { value: 'O-1' as InterestedVisa, label: 'O-1 Visa' },
  { value: 'EB-1A' as InterestedVisa, label: 'EB-1A Visa' },
  { value: 'EB-2 NIW' as InterestedVisa, label: 'EB-2 NIW' },
  { value: 'I don\'t know' as InterestedVisa, label: 'I don\'t know' }
];