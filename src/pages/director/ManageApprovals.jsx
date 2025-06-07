import React, { useState, useEffect } from 'react';
import DirectorSidePanel from '../../components/director/DirectorSidePanel';
import { Mail, Calendar, AlertCircle, Settings, User2, CheckCircle2, XCircle } from 'lucide-react';

const ManageApprovals = () => {
  // Static example data
  const [staffRequests, setStaffRequests] = useState([
    {
      id: 1,
      email: "john.doe@uclm.edu.ph",
      dateApplied: "2024-03-15",
      status: "pending"
    },
    {
      id: 2,
      email: "maria.santos@uclm.edu.ph",
      dateApplied: "2024-03-14",
      status: "pending"
    },
    {
      id: 3,
      email: "james.rodriguez@uclm.edu.ph",
      dateApplied: "2024-03-13",
      status: "approved"
    },
    {
      id: 4,
      email: "sarah.garcia@uclm.edu.ph",
      dateApplied: "2024-03-12",
      status: "rejected"
    }
  ]);

  const handleApproval = (requestId, newStatus) => {
    setStaffRequests(staffRequests.map(request => 
      request.id === requestId ? { ...request, status: newStatus } : request
    ));
  };

  // Function to get initials from email
  const getEmailInitial = (email) => {
    return email.charAt(0).toUpperCase();
  };

  // Function to get background color based on initial
  const getInitialColor = (initial) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-yellow-500',
      'bg-red-500',
      'bg-indigo-500',
      'bg-pink-500',
      'bg-teal-500'
    ];
    const index = initial.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="p-6 bg-gray-50 pt-24 pl-12">
      <div className="flex flex-col md:flex-row gap-4">
        <DirectorSidePanel />
        
        {/* Main Content */}
        <div className="flex-1 ml-12">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Email Registration Requests</h1>
              <div className="text-sm text-gray-600">
                {staffRequests.filter(r => r.status === 'pending').length} pending requests
              </div>
            </div>
            
            <div className="bg-white rounded-lg">
              {staffRequests.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No pending registration requests
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <User2 size={16} />
                            <span>Avatar</span>
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <Mail size={16} />
                            <span>Email Address</span>
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <Calendar size={16} />
                            <span>Date Applied</span>
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <AlertCircle size={16} />
                            <span>Status</span>
                          </div>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <Settings size={16} />
                            <span>Actions</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {staffRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium text-lg ${getInitialColor(getEmailInitial(request.email))}`}>
                              {getEmailInitial(request.email)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{request.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {new Date(request.dateApplied).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                request.status === 'approved' ? 'bg-green-100 text-green-800' : 
                                'bg-red-100 text-red-800'}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {request.status === 'pending' && (
                              <div className="flex space-x-4">
                                <button
                                  onClick={() => handleApproval(request.id, 'approved')}
                                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                  title="Approve"
                                >
                                  <CheckCircle2 size={20} className="text-green-600" />
                                </button>
                                <button
                                  onClick={() => handleApproval(request.id, 'rejected')}
                                  className="p-1.5 rounded-full hover:bg-gray-100 transition-colors duration-200"
                                  title="Reject"
                                >
                                  <XCircle size={20} className="text-red-600" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageApprovals; 