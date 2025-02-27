import React from 'react';
import Link from 'next/link';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-accent-light fixed h-full">
      <div className="p-6">
        <div className="font-bold text-2xl text-primary mb-12">
          almă
        </div>
        
        <nav className="space-y-2">
          <Link 
            href="/dashboard/leads" 
            className="block py-2 px-4 rounded-md bg-white text-primary font-medium"
          >
            Leads
          </Link>
          <Link 
            href="/dashboard/settings" 
            className="block py-2 px-4 rounded-md text-primary hover:bg-white/50 transition-colors"
          >
            Settings
          </Link>
        </nav>
      </div>
      
      {/* Admin badge at bottom */}
      <div className="absolute bottom-0 w-full p-6">
        <div className="flex items-center">
          <div className="bg-gray-200 text-primary rounded-full h-8 w-8 flex items-center justify-center font-semibold">
            A
          </div>
          <span className="ml-2 font-medium">Admin</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;