import React from 'react';
import { MoreHorizontal, Calendar, FileText, Download, Share2, Trash2, Eye } from 'lucide-react';
import { formatFileSize } from '../../../utils/formatFileSize.js';
import { GetFirstLetter } from '../../../utils/GetFirstLetter.js';
import { documentColorPicker } from '../../../utils/documentColorPicker.js';
import ViewDocumentModal from '../../modal/ViewDocumentModal.jsx';
import { getStatusColor, getStatusIcon, getStatusText } from '../../../constants/documentStatus.js';
import dayjs from 'dayjs';

const DocumentCard = ({ selectedDocument, onDeleteDocument, canDeleteDocument }) => {
    const [showViewDocumentModal, setShowViewDocumentModal] = React.useState(false)
    const [showDropdown, setShowDropdown] = React.useState(false)

    const handleDownloadFile = () => {
        const altribute = window.document.createElement('a')
        altribute.href = selectedDocument.public_url
        altribute.download = selectedDocument.title
        window.document.body.appendChild(altribute)
        altribute.click()
        window.document.body.removeChild(altribute);
    }

    const handleShareFile = async () => {
        if(navigator.share) {
            try {
                await navigator.share({
                    title: selectedDocument.titles,
                    text: 'Check out this document',
                    url: selectedDocument.public_url
                })
            } catch (error) {
                console.log('handle share failed: ', error.message)
            }
        }
    }

    const handleDeleteDocument = async () => {
        if (onDeleteDocument) {
            await onDeleteDocument(selectedDocument)
        }
    }

    const isDeletable = canDeleteDocument ? canDeleteDocument(selectedDocument) : true;

    const handleViewDocument = () => {
        setShowViewDocumentModal(true)
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 ${documentColorPicker(selectedDocument.file_type)} rounded-lg flex items-center justify-center shadow-sm`}>
                    <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 
                        className="font-semibold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer hover:underline"
                        onClick={handleViewDocument}
                    >
                    {selectedDocument.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500">{formatFileSize(selectedDocument.size)}</p>
                        {selectedDocument.approval_status && selectedDocument.approval_status !== 'no_request' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDocument.approval_status)}`}>
                                <span className="mr-1">{getStatusIcon(selectedDocument.approval_status)}</span>
                                {getStatusText(selectedDocument.approval_status)}
                            </span>
                        )}
                    </div>
                </div>
                </div>
                <div className="relative dropdown-container">
                <div className="relative">
                    <button 
                        className="p-2 hover:bg-gray-100 rounded-lg"
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setShowDropdown(false)}
                    >
                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                    </button>
                    
                    <div 
                        className={`absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10 transition-opacity duration-200 ${
                            showDropdown ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setShowDropdown(false)}
                    >
                        <div className="py-1">
                            <button
                                onClick={handleDownloadFile}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                            </button>
                            <button
                                onClick={handleShareFile}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                                <span>Share</span>
                            </button>
                            <button
                                onClick={handleDeleteDocument}
                                disabled={!isDeletable}
                                className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                                    isDeletable 
                                        ? 'text-red-600 hover:bg-red-50' 
                                        : 'text-gray-400 cursor-not-allowed'
                                }`}
                                title={!isDeletable ? 'Cannot delete approved documents' : ''}
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
                </div>
            </div>

            {
                selectedDocument.tags ?
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium">
                        {selectedDocument.tags}
                    </span>
                </div> : <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 bg-gray-50 py-1 rounded-full text-xs font-medium">
                        {`No Tags`}
                    </span>
                </div>
            }

            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <div className="space-x-1.5 inline-flex items-center">
                        <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs border-2 border-white">
                            {
                                selectedDocument.author.author_avatar ?
                                <img src={selectedDocument.author.author_avatar} alt={`${selectedDocument.author.author_avatar}`} className="w-full h-full rounded-full object-cover" /> :
                                GetFirstLetter(selectedDocument.author.author_firstname)
                                
                            }
                        </div>
                        <div className="flex flex-col">
                            <div className="text-xs font-medium text-gray-900">
                                {`${selectedDocument.author.author_firstname} ${selectedDocument.author.author_lastname}`}
                            </div>
                            {selectedDocument.author.department && (
                                <div className="text-xs text-gray-500">
                                    {selectedDocument.author.department.department_name}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                <Calendar className="w-4 h-4 mr-1" />
                {dayjs(selectedDocument.createdAt).format("MMMM D, YYYY")}
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 opacity-100 transition-opacity">
                <div className="flex space-x-2">
                <button onClick={() => setShowViewDocumentModal(!showViewDocumentModal)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm hover:bg-blue-100 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                </button>
                </div>
                <div className="flex space-x-1">
                <button onClick={handleDownloadFile}
                className="p-1.5 hover:bg-gray-100 rounded-lg">
                    <Download className="w-4 h-4 text-gray-500" />
                </button>
                <button onClick={handleShareFile}
                className="p-1.5 hover:bg-gray-100 rounded-lg">
                    <Share2 className="w-4 h-4 text-gray-500" />
                </button>
                </div>
            </div>
            <ViewDocumentModal
            open={showViewDocumentModal}
            setOpen={setShowViewDocumentModal}
            document={selectedDocument}
            />
        </div>
    )
};

export default DocumentCard