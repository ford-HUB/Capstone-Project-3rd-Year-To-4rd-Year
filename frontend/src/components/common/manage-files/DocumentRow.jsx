import React from 'react';
import { documentColorPicker } from '../../../utils/documentColorPicker.js';
import { GetFirstLetter } from '../../../utils/GetFirstLetter.js';
import { formatFileSize } from '../../../utils/formatFileSize.js';
import { MoreHorizontal, FileText, Download, Share2, Trash2 } from 'lucide-react';
import ViewDocumentModal from '../../modal/ViewDocumentModal.jsx';
import { getStatusColor, getStatusIcon, getStatusText } from '../../../constants/documentStatus.js';
import dayjs from 'dayjs';

const DocumentRow = ({ document, toggleDocumentSelection, selectedDocuments, canDeleteDocument, onDeleteDocument }) => {
    const [showViewDocumentModal, setShowViewDocumentModal] = React.useState(false)

    const handleDownloadFile = () => {
        const altribute = window.document.createElement('a')
        altribute.href = document.public_url
        altribute.download = document.title
        window.document.body.appendChild(altribute)
        altribute.click()
        window.document.body.removeChild(altribute);
    }

    const handleShareFile = async () => {
        if(navigator.share) {
            try {
                await navigator.share({
                    title: document.titles,
                    text: 'Check out this document',
                    url: document.public_url
                })
            } catch (error) {
                console.log('handle share failed: ', error.message)
            }
        }
    }

    const handleDeleteDocument = () => {
        if (onDeleteDocument) {
            onDeleteDocument(document);
        }
    }

    const isDeletable = canDeleteDocument ? canDeleteDocument(document) : true;

    const handleViewDocument = () => {
        setShowViewDocumentModal(true)
    }

    return (
        <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 p-4 mb-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                <input 
                    type="checkbox"
                    checked={selectedDocuments.some(d => d.document_id === document.document_id)}
                    onChange={() => toggleDocumentSelection(document)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <div className={`w-10 h-10 ${documentColorPicker(document.file_type)} rounded-lg flex items-center justify-center`}>
                    <FileText className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                    <h3 
                        className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors cursor-pointer hover:underline"
                        onClick={handleViewDocument}
                    >
                    {document.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                        <p className="text-sm text-gray-500">{formatFileSize(document.size)}</p>
                        {document.approval_status && document.approval_status !== 'no_request' && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(document.approval_status)}`}>
                                <span className="mr-1">{getStatusIcon(document.approval_status)}</span>
                                {getStatusText(document.approval_status)}
                            </span>
                        )}
                    </div>
                </div>
                </div>
                
                <div className="flex items-center space-x-8">
                {
                    document.tags && 
                    <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                            {document.tags}
                        </span>
                    </div>
                }
                
                <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-sm border-2 border-white">
                        {
                            document.author.author_avatar ? 
                            <img src={document.author.author_avatar} alt={`${document.author.author_avatar}`} className="w-full h-full rounded-full object-cover" /> :
                            GetFirstLetter(document.author.author_firstname)
                        }
                    </div>
                    <div className="flex flex-col">
                        <div className="text-xs font-medium text-gray-900">
                            {`${document.author.author_firstname} ${document.author.author_lastname}`}
                        </div>
                        {document.author.department && (
                            <div className="text-xs text-gray-500">
                                {document.author.department.department_name}
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="text-sm text-gray-500 w-24 text-right">
                    {dayjs(document.createdAt).format("MM/DD/YYYY")}
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity relative dropdown-container">
                    <div className="relative group/dot">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                            <MoreHorizontal className="w-4 h-4 text-gray-500" />
                        </button>
                        
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10 opacity-0 group-hover/dot:opacity-100 transition-opacity duration-200">
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
            </div>
            
            <ViewDocumentModal
                open={showViewDocumentModal}
                setOpen={setShowViewDocumentModal}
                document={document}
            />
        </div>
    )
};

export default DocumentRow
