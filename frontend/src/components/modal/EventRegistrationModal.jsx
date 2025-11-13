import React from "react";
import { Shield } from "lucide-react";
import { useAuthStore } from "../../store/director/useAuthStore.js";
import { useAuthStore as useAuthManagementStore } from "../../store/management/useAuthStore";

const EventRegistrationModal = ({ isOpen, onClose, event, onRegister }) => {
  const { authenticatedManagement } = useAuthManagementStore()
  const { authenticatedDirector } = useAuthStore()

  const roleType = authenticatedDirector?.Role?.name || authenticatedManagement?.Role?.name


  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-in fade-in-0 duration-200">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Join Event</h3>
        </div>
        <p className="text-gray-600 mb-6 text-sm">Register as a { authenticatedDirector?.Role?.name === 'director' ? 'director' : authenticatedManagement?.Role?.name === 'staff' ? 'staff' : authenticatedManagement?.Role?.name === 'coordinator' ? 'coordinator' : 'unauthorized role access' } for this event. Your registration will be processed with administrative privileges.</p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
          <button onClick={() => onRegister({ role: roleType, event_id: event?.id })}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Join Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationModal