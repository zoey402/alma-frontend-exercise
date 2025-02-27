import React from 'react';
import { twMerge } from 'tailwind-merge';
import { LeadStatus } from '@/types/lead';

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  // Base badge styles
  const baseBadgeStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  // Status specific styles
  const statusStyles = {
    [LeadStatus.PENDING]: 'bg-gray-100 text-pending',
    [LeadStatus.REACHED_OUT]: 'bg-accent-light text-button-primary',
  };
  
  // Combine all badge styles
  const badgeStyles = twMerge(
    baseBadgeStyles,
    statusStyles[status],
    className
  );
  
  // Status display text
  const statusText = {
    [LeadStatus.PENDING]: 'Pending',
    [LeadStatus.REACHED_OUT]: 'Reached Out',
  };
  
  return (
    <span className={badgeStyles}>
      {status === LeadStatus.REACHED_OUT && (
        <span className="mr-1.5 h-2 w-2 rounded-full bg-accent"></span>
      )}
      {statusText[status]}
    </span>
  );
};

export default StatusBadge;