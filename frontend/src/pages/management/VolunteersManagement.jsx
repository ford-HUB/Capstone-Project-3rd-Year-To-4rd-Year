import { useState } from 'react';
import { Search, Edit2, Trash2, Mail, Phone, X, ChevronDown } from 'lucide-react';

const EditVolunteerModal = ({ volunteer, onClose }) => {
  const [editedVolunteer, setEditedVolunteer] = useState({
    ...volunteer,
    programs: volunteer.programs || []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically update the volunteer data
    console.log('Updated volunteer:', editedVolunteer);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Edit Volunteer Information</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={editedVolunteer.name}
                onChange={(e) => setEditedVolunteer({ ...editedVolunteer, name: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={editedVolunteer.email}
                onChange={(e) => setEditedVolunteer({ ...editedVolunteer, email: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={editedVolunteer.phone}
                onChange={(e) => setEditedVolunteer({ ...editedVolunteer, phone: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input
                type="text"
                value={editedVolunteer.department}
                onChange={(e) => setEditedVolunteer({ ...editedVolunteer, department: e.target.value })}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Programs</label>
            <div className="border rounded-lg p-4">
              <div className="space-y-2">
                {editedVolunteer.programs.map((program, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span>{program.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{program.status}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedPrograms = [...editedVolunteer.programs];
                          updatedPrograms.splice(index, 1);
                          setEditedVolunteer({ ...editedVolunteer, programs: updatedPrograms });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const VolunteersManagement = () => {
  const [volunteers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@uclm.edu',
      phone: '+63 912 345 6789',
      department: 'Computer Studies',
      status: 'active',
      volunteerType: 'Regular',
      programs: [
        { name: 'Community Cleanup Drive', status: 'Active' },
        { name: 'Youth Mentorship Program', status: 'Completed' }
      ]
    },
    // Add more dummy data as needed
  ]);

  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Volunteers Management</h1>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search volunteers..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="relative">
          <select className="appearance-none px-4 py-2 pr-8 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700">
            <option value="">All Types</option>
            <option value="regular">Regular</option>
            <option value="occasional">Occasional</option>
            <option value="student">Student</option>
          </select>
          <ChevronDown size={16} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Volunteers Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {volunteers.map((volunteer) => (
              <tr key={volunteer.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="flex items-center text-sm text-gray-500">
                      <Mail size={14} className="mr-1" />
                      {volunteer.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone size={14} className="mr-1" />
                      {volunteer.phone}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{volunteer.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {volunteer.volunteerType}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    volunteer.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {volunteer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <button 
                      className="text-blue-600 hover:text-blue-900"
                      onClick={() => setSelectedVolunteer(volunteer)}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Volunteer Modal */}
      {selectedVolunteer && (
        <EditVolunteerModal
          volunteer={selectedVolunteer}
          onClose={() => setSelectedVolunteer(null)}
        />
      )}
    </div>
  );
};

export default VolunteersManagement; 