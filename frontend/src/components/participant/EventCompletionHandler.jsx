import React, { useState, useEffect } from 'react';
import { useProofUploadStore } from '../../store/participant/useProofUploadStore.js';
import ProofUploadModal from '../modal/ProofUploadModal.jsx';
import toast from 'react-hot-toast';

const EventCompletionHandler = ({ event, isEventCompleted, onProofUploaded }) => {
    const [showProofModal, setShowProofModal] = useState(false);
    const [proofStatus, setProofStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const { uploadEventProof, getEventProofStatus } = useProofUploadStore();

    // Check proof status when event is completed
    useEffect(() => {
        if (isEventCompleted && event?.event_id) {
            checkProofStatus();
        }
    }, [isEventCompleted, event?.event_id]);

    const checkProofStatus = async () => {
        try {
            const status = await getEventProofStatus(event.event_id);
            setProofStatus(status);
            
            // Show modal if proof is not uploaded yet
            if (status && !status.proof_uploaded) {
                setShowProofModal(true);
            }
        } catch (error) {
            console.error('Failed to check proof status:', error);
        }
    };

    const handleUploadNow = async (files) => {
        setLoading(true);
        try {
            const success = await uploadEventProof(event.event_id, files);
            if (success) {
                setShowProofModal(false);
                setProofStatus(prev => ({ ...prev, proof_uploaded: true, proof_uploaded_at: new Date() }));
                onProofUploaded && onProofUploaded();
                toast.success('Proof uploaded successfully!');
            }
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setLoading(false);
        }
    };



    // Don't render anything if event is not completed or proof is already uploaded
    if (!isEventCompleted || (proofStatus && proofStatus.proof_uploaded)) {
        return null;
    }

    return (
        <>
            <ProofUploadModal
                isOpen={showProofModal}
                onClose={() => setShowProofModal(false)}
                event={event}
                onUploadNow={handleUploadNow}
                loading={loading}
            />
        </>
    );
};

export default EventCompletionHandler;
