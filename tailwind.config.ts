import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors from the design
        primary: "#1d1d1d",
        accent: "#d9dea6", 
        "accent-light": "#f8fdd3",
        icon: "#c0c1fe",
        
        // Status colors
        pending: "#6B7280", 
        "reached-out": "#d9dea6",
        
        // Background colors
        background: "#FFFFFF",
        "background-alt": "#F9FAFB",
        "background-dark": "#1d1d1d",
        
        // Form elements
        input: "#FFFFFF",
        "input-border": "#D1D5DB",
        
        // Button colors
        "button-primary": "#1d1d1d",
        "button-text": "#FFFFFF",
        
        // Text colors
        "text-primary": "#1d1d1d",
        "text-secondary": "#6B7280",
        "text-muted": "#9CA3AF",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], 
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
} satisfies Config;