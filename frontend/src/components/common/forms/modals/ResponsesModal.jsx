import React from 'react';
import { BarChart3 } from 'lucide-react';
import Modal from '../ui/Modal';
import EmptyState from '../state/EmptyState';

const ResponsesModal = ({ isOpen, onClose, form, responses }) => {
  if (!form) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Responses: ${form.title}`} size="xl">
      <div className="p-6">
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{responses.length}</div>
              <div className="text-sm text-blue-800">Total Responses</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {responses.length > 0 ? Math.round((responses.length / (form.responses || 1)) * 100) : 0}%
              </div>
              <div className="text-sm text-green-800">Completion Rate</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {responses.length > 0 ? new Date(responses[0].submittedAt).toLocaleDateString() : 'N/A'}
              </div>
              <div className="text-sm text-purple-800">Latest Response</div>
            </div>
          </div>
        </div>

        {responses.length === 0 ? (
          <EmptyState
            icon={BarChart3}
            title="No responses yet"
            description="Share your form to start collecting responses"
          />
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Responses</h3>
            {responses.map((response, index) => (
              <div key={response.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700">Response #{index + 1}</span>
                  <span className="text-sm text-gray-500">
                    {new Date(response.submittedAt).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(response.data).map(([field, value]) => (
                    <div key={field} className="border-l-4 border-blue-200 pl-3">
                      <div className="text-sm font-medium text-gray-700">{field}</div>
                      <div className="text-sm text-gray-900">{value || 'Not answered'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ResponsesModal;
