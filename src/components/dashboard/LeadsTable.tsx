import React, { useState } from 'react';
import { Lead, LeadStatus } from '@/types/lead';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import { formatDate } from '@/mock/leads';

interface LeadsTableProps {
  leads: Lead[];
  onUpdateStatus: (leadId: string, newStatus: LeadStatus) => void;
  isUpdating?: Record<string, boolean>; 
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onUpdateStatus, isUpdating = {} }) => {
  // State to track which lead's details are expanded
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);

  // Toggle expanded state for a lead
  const toggleExpandLead = (leadId: string) => {
    setExpandedLeadId(expandedLeadId === leadId ? null : leadId);
  };

  // Format visa list for display
  const formatVisas = (visas: string[]) => {
    return visas.join(', ');
  };

  return (
    <div className="bg-white rounded-lg shadow-card overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Submitted
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Country
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Visas
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-text-secondary">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <React.Fragment key={lead.id}>
                  <tr className={`hover:bg-gray-50 ${expandedLeadId === lead.id ? 'bg-gray-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-primary">
                        {lead.firstName} {lead.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-secondary">
                        {lead.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-secondary">
                        {formatDate(lead.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-secondary">
                        {lead.countryOfCitizenship}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-text-secondary">
                        {formatVisas(lead.interestedVisas)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-end items-center space-x-4">
                        {lead.status === LeadStatus.PENDING && (
                          <Button
                            onClick={() => onUpdateStatus(lead.id, LeadStatus.REACHED_OUT)}
                            isLoading={isUpdating[lead.id]}
                            disabled={isUpdating[lead.id]}
                            className="py-1 px-3 text-sm mr-4"
                          >
                            Mark as Reached Out
                          </Button>
                        )}
                        <button
                          onClick={() => toggleExpandLead(lead.id)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm"
                        >
                          {expandedLeadId === lead.id ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedLeadId === lead.id && (
                    <tr>
                      <td colSpan={7} className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-sm mb-2">LinkedIn</h4>
                            <a 
                              href={lead.linkedin} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline break-all"
                            >
                              {lead.linkedin}
                            </a>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-2">Resume</h4>
                            {lead.resumeUrl ? (
                              <a 
                                href={lead.resumeUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-sm text-indigo-600 hover:text-indigo-700 hover:underline"
                              >
                                View Resume
                              </a>
                            ) : (
                              <span className="text-sm text-text-secondary">No resume provided</span>
                            )}
                          </div>
                          <div className="md:col-span-2">
                            <h4 className="font-medium text-sm mb-2">Additional Information</h4>
                            <p className="text-sm text-text-secondary whitespace-pre-wrap">
                              {lead.openInput || "No additional information provided"}
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;