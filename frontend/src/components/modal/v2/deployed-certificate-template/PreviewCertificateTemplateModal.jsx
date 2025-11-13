import React from 'react';
import { Download, Share2, X } from 'lucide-react';
import { renderPreview } from '../../../../utils/templateUtils.js';
import dayjs from 'dayjs';

const PreviewCertificateTemplateModal = ({ open, setOpen, currentCertificate }) => {

    if(!open) return null

    return (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col">

                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800">
                            {currentCertificate?.name}
                        </h2>
                        <p className="text-gray-600 mt-1">
                            {currentCertificate?.Category.name} •{' '}
                            {dayjs(currentCertificate?.createdAt).format('MMM D, YYYY')}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* <button
                            onClick={null}
                            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                            title="Download Certificate">
                            <Download className="w-5 h-5" />
                        </button> */}
                        <button
                            onClick={setOpen}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                            title="Close Preview">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 p-6">
                    <div className="w-full md:h-[500px] lg:h-[500px] border border-gray-200 rounded-md overflow-hidden">
                        <iframe
                            srcDoc={renderPreview(currentCertificate.html_raw_template)}
                            className="w-full h-full"
                            title={`${currentCertificate?.name} Preview`}
                            frameBorder="0"
                            loading="lazy"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreviewCertificateTemplateModal;
