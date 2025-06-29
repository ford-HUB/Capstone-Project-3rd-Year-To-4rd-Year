import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin } from 'lucide-react';

const EventRegistrationModal = ({ isOpen, event, onClose, onRegister }) => {
  const [thoughts, setThoughts] = useState('');

  if (!isOpen || !event) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister({ thoughts });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl mx-4 overflow-hidden border-2 border-solid border-gray-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 id="modal-title" className="text-2xl font-semibold text-gray-900">Join Event</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>
          <div className="mt-2">
            <h3 className="text-lg text-gray-700">{event.title}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{event.location}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div>
            <label htmlFor="thoughts" className="block text-sm font-medium text-gray-700 mb-1">
              Your Thoughts (Optional)
            </label>
            <textarea
              id="thoughts"
              value={thoughts}
              onChange={(e) => setThoughts(e.target.value)}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Share your thoughts or expectations about this event..."
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Join Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventRegistrationModal;