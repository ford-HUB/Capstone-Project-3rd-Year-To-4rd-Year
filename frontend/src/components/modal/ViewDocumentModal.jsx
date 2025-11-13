import React, { useState, useEffect } from 'react'
import { formatFileSize } from '../../utils/formatFileSize.js';
import { X, Download, ZoomIn, ZoomOut, RotateCw, Maximize2, Share2, FileText, Clock, User } from 'lucide-react';
import dayjs from 'dayjs';

const ViewDocumentModal = ({ open, setOpen, mode, document, onComplete }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [isFullscreen, setIsFullscreen] = useState(false);
    
    const isEdit = mode === 'edit';
    
    useEffect(() => {
        if (open) {
            setIsLoading(true);
            const timer = setTimeout(() => setIsLoading(false), 1500);
            return () => clearTimeout(timer);
        }
    }, [open]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && open) {
                setOpen(false);
            }
        };
        
        if (typeof document !== 'undefined' && open) {
            window.document.addEventListener('keydown', handleEscape);
            return () => window.document.removeEventListener('keydown', handleEscape);
        }
    }, [open, setOpen]);

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

    if (!open) return null;

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
    const handleFullscreen = () => setIsFullscreen(!isFullscreen);

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
            <div className={`bg-white rounded-2xl shadow-2xl w-full transition-all duration-300 ${
                isFullscreen ? 'max-w-7xl h-[95vh]' : 'max-w-4xl max-h-[90vh]'
            } flex flex-col overflow-hidden`}>
                
                <header className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                                    {document.title}
                                </h1>
                                <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span className="flex items-center space-x-1">
                                        <FileText className="w-4 h-4" />
                                        <span>{formatFileSize(document.size)}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <User className="w-4 h-4" />
                                        <span>{`${document.author.author_firstname} ${document.author.author_lastname}`}</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                        <Clock className="w-4 h-4" />
                                        <span>Modified {dayjs(document.updatedAt).format("MMMM D, YYYY")}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => setOpen(false)}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 group"
                            aria-label="Close document viewer"
                        >
                            <X className="w-6 h-6 text-gray-500 group-hover:text-gray-700" />
                        </button>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleZoomOut}
                                disabled={zoomLevel <= 50}
                                className="p-2 hover:bg-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Zoom out"
                            >
                                <ZoomOut className="w-4 h-4 text-gray-600" />
                            </button>
                            
                            <span className="px-3 py-1 bg-white rounded-lg text-sm font-medium text-gray-700 min-w-[60px] text-center">
                                {zoomLevel}%
                            </span>
                            
                            <button
                                onClick={handleZoomIn}
                                disabled={zoomLevel >= 200}
                                className="p-2 hover:bg-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-label="Zoom in"
                            >
                                <ZoomIn className="w-4 h-4 text-gray-600" />
                            </button>

                            <div className="w-px h-6 bg-gray-300 mx-2" />

                            <button
                                onClick={handleFullscreen}
                                className="p-2 hover:bg-white rounded-lg transition-colors duration-200"
                                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                            >
                                <Maximize2 className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                            onClick={handleShareFile}
                            className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-white rounded-lg transition-colors duration-200">
                                <Share2 className="w-4 h-4" />
                                <span className="text-sm font-medium">Share</span>
                            </button>
                            
                            <button
                            onClick={handleDownloadFile}
                            className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-white rounded-lg transition-colors duration-200">
                                <Download
                                className="w-4 h-4" />
                                <span className="text-sm font-medium">Download</span>
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 bg-gray-100 p-6 overflow-auto">
                    <div className="bg-white rounded-lg shadow-sm h-full min-h-[500px] relative">
                        {isLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-gray-600 font-medium">Loading document...</p>
                                    <p className="text-sm text-gray-500 mt-1">Please wait while we prepare your document</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center w-full h-screen overflow-auto p-4">
                                <div
                                    style={{
                                        transform: `scale(${zoomLevel / 100})`,
                                        transformOrigin: "top center",
                                        width: `${10000 / zoomLevel}%`,
                                        height: `${10000 / zoomLevel}%`,
                                    }}
                                >
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(document.public_url)}`}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </main>

                {isEdit && (
                    <footer className="bg-gray-50 border-t border-gray-200 px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>Auto-save enabled</span>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                                <button 
                                    onClick={() => setOpen(false)}
                                    className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={() => {
                                        onComplete?.();
                                        setOpen(false);
                                    }}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 font-medium shadow-sm"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </footer>
                )}
            </div>
        </div>
    );
};

export default ViewDocumentModal;