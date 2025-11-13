import React, { useState } from 'react';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

const ShareModal = ({ isOpen, onClose, form }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (form?.shareUrl) {
      await navigator.clipboard.writeText(form.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!form) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Form">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Share "{form.title}"</h3>
          <p className="text-gray-600">Copy the link below to share this form with others.</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Public Form URL</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={form.shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <Button onClick={copyToClipboard} variant={copied ? "success" : "outline"}>
                {copied ? <CheckCircle size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <ExternalLink className="text-blue-600 mt-0.5 mr-3" size={16} />
              <div>
                <h4 className="text-sm font-medium text-blue-900">Share Instructions</h4>
                <p className="text-sm text-blue-800 mt-1">
                  Anyone with this link can access and submit responses to your form. 
                  The form is currently <strong>{form.status}</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ShareModal;
