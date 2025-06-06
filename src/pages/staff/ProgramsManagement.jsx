import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Users, Calendar, Clock, MapPin, X, Eye, ChevronDown } from 'lucide-react';
import CreateProgramModal from '../../components/staff/CreateProgramModal';

const ViewProgramModal = ({ program, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-xl font-semibold">Program Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Program Title</h3>
              <p className="text-lg font-medium">{program.title}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Type</h3>
              <span className="px-2 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
                {program.type}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Start Date</h3>
              <p>{program.startDate}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">End Date</h3>
              <p>{program.endDate}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
              <p>{program.location}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
              <span className={`px-2 py-1 text-sm rounded-full ${
                program.status === 'active' 
                  ? 'bg-green-100 text-green-800'
                  : program.status === 'upcoming'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
              </span>
            </div>
          </div>

          <div className="mt-6 pt-6">
            <h3 className="text-lg font-medium mb-4">Participants ({program.participants})</h3>
            {/* Add participant list here if needed */}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EditProgramModal = ({ program, onClose }) => {
  const [editedProgram, setEditedProgram] = useState({ ...program });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically update the program data
    console.log('Updated program:', editedProgram);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl shadow-lg">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-xl font-semibold">Edit Program</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Title</label>
              <input
                type="text"
                value={editedProgram.title}
                onChange={(e) => setEditedProgram({ ...editedProgram, title: e.target.value })}
                className="w-full p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={editedProgram.type}
                onChange={(e) => setEditedProgram({ ...editedProgram, type: e.target.value })}
                className="w-full p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Environmental">Environmental</option>
                <option value="Educational">Educational</option>
                <option value="Health">Health</option>
                <option value="Community">Community</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={editedProgram.startDate}
                onChange={(e) => setEditedProgram({ ...editedProgram, startDate: e.target.value })}
                className="w-full p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={editedProgram.endDate}
                onChange={(e) => setEditedProgram({ ...editedProgram, endDate: e.target.value })}
                className="w-full p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={editedProgram.location}
                onChange={(e) => setEditedProgram({ ...editedProgram, location: e.target.value })}
                className="w-full p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={editedProgram.status}
                onChange={(e) => setEditedProgram({ ...editedProgram, status: e.target.value })}
                className="w-full p-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
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

const ProgramsManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [viewProgram, setViewProgram] = useState(null);
  const [programs] = useState([
    {
      id: 1,
      title: 'Community Cleanup Drive',
      type: 'Environmental',
      startDate: '2024-03-20',
      endDate: '2024-03-21',
      location: 'City Park',
      participants: 45,
      status: 'upcoming'
    },
    {
      id: 2,
      title: 'Youth Mentorship Program',
      type: 'Educational',
      startDate: '2024-04-01',
      endDate: '2024-06-30',
      location: 'Main Campus',
      participants: 30,
      status: 'active'
    },
    {
      id: 3,
      title: 'Health & Wellness Workshop',
      type: 'Health',
      startDate: '2024-03-25',
      endDate: '2024-03-25',
      location: 'Community Center',
      participants: 25,
      status: 'upcoming'
    }
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Programs Management</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Create Program
        </button>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search programs..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="px-4 py-2 bg-white shadow-sm rounded-lg text-gray-700 hover:bg-gray-50 flex items-center gap-2">
          Type
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium">{program.title}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                program.type === 'Environmental' ? 'bg-green-100 text-green-800' :
                program.type === 'Educational' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {program.type}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar size={16} />
                {program.startDate} - {program.endDate}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin size={16} />
                {program.location}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users size={16} />
                {program.participants} Participants
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setViewProgram(program)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
              >
                <Eye size={18} />
              </button>
              <button
                onClick={() => setSelectedProgram(program)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-50"
              >
                <Edit2 size={18} />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateProgramModal onClose={() => setShowCreateModal(false)} />
      )}

      {selectedProgram && (
        <EditProgramModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      )}

      {viewProgram && (
        <ViewProgramModal
          program={viewProgram}
          onClose={() => setViewProgram(null)}
        />
      )}
    </div>
  );
};

export default ProgramsManagement; 