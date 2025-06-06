import { useState } from 'react';
import { Plus, Edit2, Trash2, Copy, Eye, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ViewTemplateModal = ({ template, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl shadow-lg">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-xl font-semibold">View Certificate Template</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium">{template.name}</h3>
                <p className="text-gray-500">{template.description}</p>
              </div>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                template.status === 'default' 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">Last Modified:</span> {template.lastModified}
              </div>
              <div>
                <span className="font-medium">Usage Count:</span> {template.usageCount} times
              </div>
            </div>
          </div>

          {/* Certificate Preview */}
          <div className="rounded-lg p-4 bg-gray-50 mb-6">
            <div className="aspect-[1.414/1] bg-white rounded shadow-sm p-8">
              {/* This would be replaced with the actual certificate template preview */}
              <div className="p-8 h-full flex flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-serif mb-4">Certificate of {template.name}</h1>
                <p className="text-lg mb-8">This is to certify that</p>
                <p className="text-xl font-medium mb-2">[Participant Name]</p>
                <p className="text-lg mb-8">has successfully completed</p>
                <p className="text-xl mb-8">[Program/Event Name]</p>
                <div className="mt-auto flex justify-between w-full">
                  <div className="text-center">
                    <div className="w-40 mb-2 border-t border-gray-200"></div>
                    <p className="text-sm">Date</p>
                  </div>
                  <div className="text-center">
                    <div className="w-40 mb-2 border-t border-gray-200"></div>
                    <p className="text-sm">Signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
            <Link
              to={`/staff/certificates/editor/${template.id}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Edit Template
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const CertificateManagement = () => {
  const [templates] = useState([
    {
      id: 1,
      name: 'Volunteer Service Certificate',
      description: 'Standard certificate for volunteer service completion',
      status: 'default',
      lastModified: '2024-03-15',
      usageCount: 156
    },
    {
      id: 2,
      name: 'Event Participation Certificate',
      description: 'Certificate for event participation and completion',
      status: 'active',
      lastModified: '2024-03-10',
      usageCount: 89
    },
    {
      id: 3,
      name: 'Achievement Certificate',
      description: 'Special recognition for outstanding contributions',
      status: 'active',
      lastModified: '2024-03-05',
      usageCount: 45
    }
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(null);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Certificate Management</h1>
        <Link
          to="/staff/certificates/editor"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Create Template
        </Link>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div key={template.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-lg">{template.name}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                template.status === 'default' 
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }`}>
                {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-4">{template.description}</p>

            <div className="space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>Last Modified:</span>
                <span>{template.lastModified}</span>
              </div>
              <div className="flex justify-between">
                <span>Usage Count:</span>
                <span>{template.usageCount}</span>
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button 
                onClick={() => setSelectedTemplate(template)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                title="View Template"
              >
                <Eye size={18} />
              </button>
              <Link 
                to={`/staff/certificates/editor/${template.id}`}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                title="Edit Template"
              >
                <Edit2 size={18} />
              </Link>
              <button 
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
                title="Duplicate Template"
              >
                <Copy size={18} />
              </button>
              <button 
                className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50"
                title="Delete Template"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* View Template Modal */}
      {selectedTemplate && (
        <ViewTemplateModal
          template={selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      )}
    </div>
  );
};

export default CertificateManagement; 