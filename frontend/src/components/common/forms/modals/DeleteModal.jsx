import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const DeleteModal = ({ isOpen, onClose, form, onConfirm }) => {
  if (!form) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Form" size="sm">
      <div className="p-6">
        <div className="flex items-start mb-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-gray-900">Delete "{form.title}"?</h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                This action cannot be undone. All {form.responses} responses will be permanently deleted.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => { onConfirm(form); onClose(); }}>
            <Trash2 size={16} className="mr-2" />
            Delete Form
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
