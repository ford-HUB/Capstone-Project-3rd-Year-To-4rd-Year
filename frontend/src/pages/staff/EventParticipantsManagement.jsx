import { useState } from 'react';
import { Search, Users, Calendar, MapPin, Filter } from 'lucide-react';

const EventParticipantsManagement = () => {
  const [events] = useState([
    {
      id: 1,
      title: 'Community Cleanup Drive',
      date: '2024-03-20',
      location: 'City Park',
      participants: [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@uclm.edu',
          role: 'Coordinator',
          status: 'confirmed'
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@uclm.edu',
          role: 'Volunteer',
          status: 'confirmed'
        },
        {
          id: 3,
          name: 'Mike Wilson',
          email: 'mike.wilson@uclm.edu',
          role: 'Staff',
          status: 'confirmed'
        }
      ]
    },
    {
      id: 2,
      title: 'Tech Workshop',
      date: '2024-03-22',
      location: 'Main Campus',
      participants: [
        {
          id: 4,
          name: 'Sarah Johnson',
          email: 'sarah.j@uclm.edu',
          role: 'Staff',
          status: 'confirmed'
        },
        {
          id: 5,
          name: 'Tom Brown',
          email: 'tom.b@uclm.edu',
          role: 'Coordinator',
          status: 'confirmed'
        }
      ]
    }
  ]);

  const [selectedEvent, setSelectedEvent] = useState(events[0]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Participants</h1>
      </div>

      {/* Event Selection and Search */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <select 
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setSelectedEvent(events.find(event => event.id === parseInt(e.target.value)))}
            value={selectedEvent?.id}
          >
            {events.map(event => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white p-4 rounded-lg border space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{selectedEvent?.title}</h2>
            <span className="text-sm text-gray-500">
              Total Participants: {selectedEvent?.participants.length}
            </span>
          </div>
          <div className="flex gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              {selectedEvent?.date}
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              {selectedEvent?.location}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search participants..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600">
            <option value="">All Roles</option>
            <option value="staff">Staff</option>
            <option value="coordinator">Coordinator</option>
            <option value="volunteer">Volunteer</option>
          </select>
        </div>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedEvent?.participants.map((participant) => (
              <tr key={participant.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{participant.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    participant.role === 'Staff' 
                      ? 'bg-purple-100 text-purple-800'
                      : participant.role === 'Coordinator'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {participant.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    {participant.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Role Distribution */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Role Distribution</h3>
        <div className="flex gap-4">
          {['Staff', 'Coordinator', 'Volunteer'].map(role => {
            const count = selectedEvent?.participants.filter(p => p.role === role).length || 0;
            return (
              <div key={role} className="flex-1 bg-gray-50 rounded-lg p-3">
                <div className="text-sm text-gray-600">{role}s</div>
                <div className="text-2xl font-semibold mt-1">{count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default EventParticipantsManagement; 