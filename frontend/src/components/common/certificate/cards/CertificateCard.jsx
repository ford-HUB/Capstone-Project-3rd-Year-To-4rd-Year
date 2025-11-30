import React from 'react';
import CertificateInfoModal from '../../../modal/CertificateInfoModal';
import { useAuthStore as useAuthParticipantStore } from '../../../../store/participant/useAuthStore';
import { useAuthStore as useAuthManagementStore } from '../../../../store/management/useAuthStore';
import { useAuthStore as useAuthDirectorStore } from '../../../../store/director/useAuthStore';
import dayjs from 'dayjs';

const CertificateCard = ({ certificateData }) => {
    const [showCertificateModal, setShowCertificateModal] = React.useState(false)
    const { authenticatedUser } = useAuthParticipantStore()
    const { authenticatedManagement } = useAuthManagementStore()
    const { authenticatedDirector } = useAuthDirectorStore()

    const routeRoleDestination = 
    authenticatedUser?.Role.name === 'volunteer' ? 'participant' : 
    ['staff', 'coordinator', 'assistant_coordinator'].includes(authenticatedManagement?.Role.name) ?
    'management': authenticatedDirector?.Role.name === 'director' ? 'director' : 'unauthorized access'

    return (
        <>
            <div onClick={() => setShowCertificateModal(true)} className="hover:scale-105 transform duration-300 flex items-center justify-center">
            <div className="w-80">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer">
                    <div className="bg-green-500 text-white text-xs font-medium px-3 py-1.5 inline-block">
                        Certificate
                    </div>

                    <div className="flex justify-center py-8 px-4">
                        <div className="w-20 h-16 border-2 border-green-400 rounded flex items-center justify-center bg-white">
                            <svg
                                width="48"
                                height="38"
                                viewBox="0 0 48 38"
                                fill="none"
                                className="text-green-500">
                                <rect
                                    x="4"
                                    y="8"
                                    width="36"
                                    height="24"
                                    rx="1"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="none"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="4"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="none"
                                />
                                <path
                                    d="M8 16 L12 20 L16 16"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    fill="none"
                                />
                                <line
                                    x1="22"
                                    y1="14"
                                    x2="34"
                                    y2="14"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                />
                                <line
                                    x1="22"
                                    y1="18"
                                    x2="34"
                                    y2="18"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                />
                                <line
                                    x1="22"
                                    y1="22"
                                    x2="30"
                                    y2="22"
                                    stroke="currentColor"
                                    strokeWidth="1"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className="px-4 pb-4">
                        <div className="text-center mb-4">
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
                                {certificateData.eventDetails?.category_name}
                            </p>
                            <h3 className="font-semibold text-gray-900 text-base leading-tight">
                                {certificateData.title || ''}
                            </h3>
                        </div>
                    </div>

                    <div className="bg-gray-50 px-4 py-3">
                        <p className="text-sm text-gray-600 text-center">
                            Issued On: { dayjs(certificateData.issued_at).format('MMM DD, YYYY') }
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <CertificateInfoModal
            dest={routeRoleDestination}
            certificateData={certificateData}
            isOpen={showCertificateModal}
            setOpen={() => setShowCertificateModal(false)}
        />
        </>
    );
};

export default CertificateCard;
