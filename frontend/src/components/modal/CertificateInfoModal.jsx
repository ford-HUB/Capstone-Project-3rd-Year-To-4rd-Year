import React from 'react';
import { NavLink } from 'react-router-dom';
import dayjs from 'dayjs';
import { X } from 'lucide-react';

const CertificateInfoModal = ({ dest, certificateData, isOpen, setOpen }) => {
    const queryData = {
        title: certificateData.title,
        certId: certificateData.cert_uuid,
        preview_url: certificateData.cert_img,
        downloadable: certificateData.cert_pdf,
        issued_at: certificateData.issued_at,
        series_id: certificateData.series_id,
        organizer: certificateData.eventDetails.organizer
    }

    if(!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">

                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h1 className="text-xl font-semibold text-gray-900">
                        { certificateData.title }
                    </h1>
                    <button
                        onClick={setOpen}
                        className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex items-start gap-4 mb-8">
                        <div className="flex-shrink-0 w-20 h-16 bg-green-100 rounded-lg border-2 border-green-200 flex items-center justify-center">
                            <div className="text-green-600">
                                <svg
                                    className="w-12 h-10"
                                    fill="currentColor"
                                    viewBox="0 0 24 24">
                                    <path d="M14,2A8,8 0 0,0 6,10A8,8 0 0,0 14,18A8,8 0 0,0 22,10A8,8 0 0,0 14,2M14,16A6,6 0 0,1 8,10A6,6 0 0,1 14,4A6,6 0 0,1 20,10A6,6 0 0,1 14,16Z" />
                                    <rect
                                        x="9"
                                        y="8"
                                        width="10"
                                        height="1"
                                        rx="0.5"
                                    />
                                    <rect
                                        x="9"
                                        y="10"
                                        width="8"
                                        height="1"
                                        rx="0.5"
                                    />
                                    <rect
                                        x="9"
                                        y="12"
                                        width="6"
                                        height="1"
                                        rx="0.5"
                                    />
                                    <circle
                                        cx="6"
                                        cy="9"
                                        r="2"
                                    />
                                    <path d="M6,11L4,13L6,15L8,13L6,11Z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-medium text-gray-900 mb-1">
                                { certificateData.title }
                            </h2>
                            <p className="text-gray-600">{ certificateData.eventDetails.event_description }</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                ISSUED DATE
                            </h3>
                            <p className="text-base font-semibold text-gray-900">
                                { dayjs(certificateData.issued_at).format('MMM DD, YYYY') }
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                ORGANIZER
                            </h3>
                            <p className="text-base font-semibold text-gray-900">
                                { certificateData.eventDetails.organizer }
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                                TOTAL HOURS
                            </h3>
                            <p className="text-base font-semibold text-gray-900">
                                { certificateData.eventDetails.totalDuration }
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                            YOU RECEIVED CERTIFICATE
                        </h3>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-700">
                                {`${certificateData.title}: ${certificateData.eventDetails.event_description}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <NavLink to={`https://uclmcares.online/${dest}/certificate-viewer?title=${queryData.title}&certId=${queryData.certId}&preview_url=${queryData.preview_url}&downloadable=${queryData.downloadable}&series_id=${queryData.series_id}&issued_at=${queryData.issued_at}&organizer=${queryData.organizer}`} className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors">
                            View & Download
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateInfoModal;
