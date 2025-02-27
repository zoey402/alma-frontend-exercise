'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { LoginCredentials } from '@/types/auth';
import { setCookie } from 'cookies-next';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const { 
    control, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setError(null);
      
      // For demo purposes, check against hardcoded credentials
      if (data.email === 'admin@example.com' && data.password === 'password123') {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Store auth token in cookies
        setCookie('authToken', 'mock-jwt-token', { 
          maxAge: 60 * 60 * 24, // 1 day
          path: '/' 
        });
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify({
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
          role: 'admin',
        }));
        
        // Redirect to dashboard
        router.push('/dashboard/');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="text-center font-bold text-3xl text-primary mb-2">
            almă
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-text-primary">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-text-secondary">
            Access the admin dashboard to manage leads
          </p>
        </div>
        
        <div className="mt-8 bg-white py-8 px-4 shadow-card sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-md p-4 text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                Email address
              </label>
              <div className="mt-1">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      autoComplete="email"
                      error={errors.email?.message}
                      {...field}
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                Password
              </label>
              <div className="mt-1">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      error={errors.password?.message}
                      {...field}
                    />
                  )}
                />
              </div>
              <div className="text-sm text-right mt-1">
                <span className="text-xs text-accent hover:text-accent/80 cursor-pointer">
                  Hint: password123
                </span>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={isSubmitting}
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}