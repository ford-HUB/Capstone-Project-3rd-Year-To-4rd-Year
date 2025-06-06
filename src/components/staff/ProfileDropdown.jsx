import { useState } from 'react';
import { UserCircle, ChevronDown, Edit, Key, LogOut } from 'lucide-react';

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);
  
  // Dummy user data - replace with actual user data from your auth system
  const user = {
    name: "John Doe",
    email: "john.doe@uclm.edu",
    role: "Staff Administrator"
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors w-full"
      >
        <div className="flex items-center gap-3 flex-1">
          <UserCircle size={32} className="text-gray-600" />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-700">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-500 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-lg border py-2">
          <button
            onClick={() => {
              setShowEditModal(true);
              setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Edit size={16} />
            Edit Profile
          </button>
          <button
            onClick={() => {
              setShowEditModal(true);
              setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Key size={16} />
            Change Password
          </button>
          <hr className="my-1" />
          <button
            onClick={() => {
              // Add logout logic here
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              // Add form submission logic here
              setShowEditModal(false);
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <input
                    type="text"
                    defaultValue={user.role}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown; 