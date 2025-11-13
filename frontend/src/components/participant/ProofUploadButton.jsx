import React, { useState } from 'react';
import { Upload, CheckCircle } from 'lucide-react';
import { useProofUploadStore } from '../../store/participant/useProofUploadStore.js';
import ProofUploadModal from '../modal/ProofUploadModal.jsx';
import toast from 'react-hot-toast';

const ProofUploadButton = ({ event, registration, onStatusUpdate }) => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const { uploadEventProof } = useProofUploadStore();

    const handleUploadNow = async (files) => {
        setLoading(true);
        try {
            const success = await uploadEventProof(event.event_id, files);
            if (success) {
                setShowModal(false);
                onStatusUpdate && onStatusUpdate();
                toast.success('Proof uploaded successfully!');
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setLoading(false);
        }
    };


    // Don't show button if event is not completed
    if (event.status !== 'Completed') {
        return null;
    }

    // Show different states based on proof upload status
    if (registration?.proof_uploaded) {
        return (
            <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Proof Uploaded</span>
            </div>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-100 border border-orange-200 rounded-md hover:bg-orange-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
            >
                <Upload className="w-4 h-4" />
                Upload Proof
            </button>

            <ProofUploadModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                event={event}
                onUploadNow={handleUploadNow}
                loading={loading}
            />
        </>
    );
};

export default ProofUploadButton;
