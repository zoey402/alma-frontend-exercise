import { z } from 'zod';
import { InterestedVisa } from '@/types/lead';

// Form validation schema
export const leadFormSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  linkedin: z.string().url({ message: 'Please enter a valid LinkedIn URL' }),
  countryOfCitizenship: z.string().min(1, { message: 'Country of citizenship is required' }),
  interestedVisas: z.array(
    z.enum(['O-1', 'EB-1A', 'EB-2 NIW', 'I don\'t know'] as [InterestedVisa, ...InterestedVisa[]])
  ).min(1, { message: 'Please select at least one visa option' }),
  resume: z.instanceof(File, { message: 'Resume is required' }).or(z.null()),
  openInput: z.string().optional(),
});

export type LeadFormSchemaType = z.infer<typeof leadFormSchema>;