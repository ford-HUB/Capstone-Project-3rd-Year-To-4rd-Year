import React, { useState } from 'react';
import {
    Search,
    Upload,
    FileText,
    Grid,
    List,
    CheckSquare,
} from 'lucide-react';
import { documentTypeCounter } from '../../utils/documentTypeCounter.js';
import DocumentRow from '../../components/common/manage-files/DocumentRow';
import DocumentCard from '../../components/common/manage-files/DocumentCard';
import NavigationTabs from '../../components/common/manage-files/Navigation/NavigationTabs';
import MonthlyTodoContent from '../../components/common/manage-files/MonthlyTodo/MonthlyTodoContent';
import SubmittedFilesTable from '../../components/common/manage-files/MonthlyTodo/SubmittedFilesTable';
import { useAuthStore as useAuthDirectorStore } from '../../store/director/useAuthStore.js';
import { useAuthStore as useAuthManagementStore } from '../../store/management/useAuthStore.js';
import { useDocumentStore } from '../../store/common/useDocumentStore.js';
import { getAllDocumentsAsSubmissions } from '../../services/common/submissionService.js';
import useMonthlyTodoStore from '../../store/common/useMonthlyTodoStore.js';
import useMonthlyTodo from '../../hooks/useMonthlyTodo.js';
import { useSearchParams } from 'react-router-dom';
import { DOCUMENT_STATUS } from '../../constants/documentStatus.js';

const ManageFiles = () => {
    const [viewMode, setViewMode] = useState('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [submissionList, setSubmissionList] = useState([]);

    const [searchParams, setSearchParams] = useSearchParams();
    
    const { authenticatedDirector } = useAuthDirectorStore()
    const { authenticatedManagement } = useAuthManagementStore()
    
    // Check if user is coordinator or staff
    const userRole = authenticatedManagement?.Role?.name;
    const isCoordinator = userRole === 'coordinator';
    const isAssistantCoordinator = userRole === 'assistant_coordinator';
    const isStaff = userRole === 'staff';
    const isDirector = authenticatedDirector;
    
    const currentTab = searchParams.get('tab') || (isCoordinator ? 'monthly-todo' : (isAssistantCoordinator ? 'my-documents' : (isStaff || isDirector ? 'all-records-documents' : 'all-records-documents')));

    const { getAllDocuments, documentList, deleteDocument } = useDocumentStore()
    
    // Use the custom hook for monthlyTodo functionality (coordinator only)
    const {
        documents: monthlyTodoDocuments,
        requirements: monthlyTodoRequirements,
        loading: monthlyTodoLoading,
        error: monthlyTodoError,
        hasDocuments: hasMonthlyTodoDocuments,
        hasRequirements: hasMonthlyTodoRequirements,
        documentCount: monthlyTodoDocumentCount,
        requirementsCount: monthlyTodoRequirementsCount
    } = useMonthlyTodo(userRole, currentTab === 'monthly-todo' && isCoordinator)
      

    React.useEffect(() => {
        const defaultTab = isCoordinator ? 'monthly-todo' : (isAssistantCoordinator ? 'my-documents' : 'all-records-documents');
        setSearchParams({ tab: defaultTab });
    }, [isCoordinator, isAssistantCoordinator, isStaff, isDirector]);

    // Fetch documents when component mounts or tab changes
    React.useEffect(() => {
        const fetchDocuments = async () => {
            await getAllDocuments(currentTab);
        };
        
        // Always fetch for staff, directors, and assistant coordinators when tab changes
        if (isStaff || isDirector || isAssistantCoordinator) {
            fetchDocuments();
        } else if (isCoordinator && currentTab === 'monthly-todo') {
            // Let the monthlyTodo hook handle this
        } else if (isCoordinator && currentTab === 'my-documents') {
            // Fetch documents for coordinator's my-documents tab
            fetchDocuments();
        } else {
            // For other cases, fetch if no documents
            if (!documentList || documentList.length === 0) {
                fetchDocuments();
            }
        }
    }, [currentTab, isStaff, isDirector, isAssistantCoordinator, isCoordinator, getAllDocuments]);

    // Update submissionList for backward compatibility when monthlyTodo data changes
    React.useEffect(() => {
        if (currentTab === 'monthly-todo' && monthlyTodoDocuments) {
            setSubmissionList(monthlyTodoDocuments);
        } else if (currentTab !== 'monthly-todo') {
            setSubmissionList([]);
        }
    }, [currentTab, monthlyTodoDocuments, monthlyTodoDocumentCount]);

    const fileTypeCounts = documentTypeCounter(documentList);

    // Helper function to check if a document can be deleted
    const canDeleteDocument = (document) => {
        // For coordinators and staff, prevent deletion of approved documents
        if ((isCoordinator || isStaff || isAssistantCoordinator) && document.approval_status === DOCUMENT_STATUS.APPROVED) {
            return false;
        }
        return true;
    };

    // Helper function to filter out non-deletable documents
    const getDeletableDocuments = (documents) => {
        return documents.filter(canDeleteDocument);
    };

    const fileCategories = React.useMemo(() => {
        const totalFiles = Object.values(fileTypeCounts).reduce((a, b) => a + b, 0);
      
        const pdfCount = fileTypeCounts['application/pdf'] || 0;
        const sheetsCount =
          (fileTypeCounts['application/vnd.ms-excel'] || 0) +
          (fileTypeCounts['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] || 0);
        const docsCount =
          (fileTypeCounts['application/msword'] || 0) +
          (fileTypeCounts['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] || 0);
        const zipCount = fileTypeCounts['application/zip'] || 0;
      
        const othersCount = totalFiles - (pdfCount + sheetsCount + docsCount + zipCount);
      
        return [
          {
            name: 'PDF Files',
            count: pdfCount,
            color: 'bg-red-500',
            icon: '📄',
          },
          {
            name: 'Google Sheets',
            count: sheetsCount,
            color: 'bg-green-500',
            icon: '📊',
          },
          {
            name: 'Google Docs',
            count: docsCount,
            color: 'bg-blue-500',
            icon: '📝',
          },
          {
            name: 'ZIP Files',
            count: zipCount,
            color: 'bg-cyan-500',
            icon: '🗜️',
          },
          {
            name: 'Others',
            count: othersCount > 0 ? othersCount : 0,
            color: 'bg-gray-500',
            icon: '📁',
          },
        ];
      }, [fileTypeCounts]);
      

    
    const filteredDocuments = React.useMemo(() => {
        let filtered = documentList?.filter(
            (doc) => doc.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (selectedFilter === 'all' || doc.category.toLowerCase().includes(selectedFilter.toLowerCase()))
        );

        // Apply tab-specific filtering
        if (currentTab === 'approved-files') {
            filtered = filtered?.filter(doc => doc.approval_status === DOCUMENT_STATUS.APPROVED);
        } else if (currentTab === 'submitted-documents') {
            filtered = filtered?.filter(doc => doc.approval_status === DOCUMENT_STATUS.PENDING || doc.approval_status === DOCUMENT_STATUS.REJECTED);
        }

        return filtered;
    }, [documentList, searchTerm, selectedFilter, currentTab]);

    const toggleDocumentSelection = (document) => {
        setSelectedDocuments((prev) =>
          prev.some((d) => d.document_id === document.document_id)
            ? prev.filter((d) => d.document_id !== document.document_id)
            : [...prev, document]
        );
      };

      const handleDownloadFile = async (documents) => {
        for (const doc of documents) {
            const link = window.document.createElement('a')
            link.href = doc.public_url
            link.download = doc.title
            window.document.body.appendChild(link)
            link.click()
            window.document.body.removeChild(link)
            await new Promise((resolve) => setTimeout(resolve, 500))
        }
    }
    

    const handleShareFile = async (documents) => {
        for (const document of documents) {
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
    }

    const handleDeleteDocuments = async (document) => {
        // Handle both single document and array of documents
        const documentsToDelete = Array.isArray(document) ? document : [document];
        
        // Filter out documents that cannot be deleted
        const deletableDocuments = getDeletableDocuments(documentsToDelete);
        
        if (deletableDocuments.length === 0) {
            alert('Cannot delete approved documents. Please select other documents.');
            return;
        }
        
        if (deletableDocuments.length < documentsToDelete.length) {
            const nonDeletableCount = documentsToDelete.length - deletableDocuments.length;
            if (!confirm(`Some documents cannot be deleted (${nonDeletableCount} approved documents will be skipped). Continue with the remaining ${deletableDocuments.length} documents?`)) {
                return;
            }
        }
        
        for (const doc of deletableDocuments) {
            console.log(doc.document_id)
            const success = await deleteDocument(doc.document_id)
            if(!success) return 
            await getAllDocuments()
            setSelectedDocuments([])
        }
    }

    // Navigation tabs data - show monthly-todo only for coordinators, all records for staff and directors
    const navTabs = isCoordinator
        ? [
            { key: 'monthly-todo', icon: CheckSquare, label: 'Monthly To-Do' },
            { key: 'my-documents', icon: FileText, label: 'Documents' },
          ]
        : isAssistantCoordinator
        ? [
            { key: 'my-documents', icon: FileText, label: 'Documents Recorded' },
          ]
        : (isStaff || isDirector)
        ? [
            { key: 'all-records-documents', icon: FileText, label: 'All Records' },
          ]
        : [
            { key: 'unauthorized', icon: FileText, label: 'No Records' },
          ];
    

    const handleTabChange = (tabKey) => {
        setSearchParams({ tab: tabKey });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {currentTab === 'monthly-todo' ? 'Monthly To-Do' 
                             : currentTab === 'my-documents' ? (isAssistantCoordinator ? 'Documents Recorded' : 'My Documents')
                             : currentTab === 'approved-files' ? 'Approved Files'
                             : currentTab === 'submitted-documents' ? 'Submitted Documents'
                             : 'All Document Records'}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {currentTab === 'monthly-todo' 
                                ? 'Track required submissions and manage monthly tasks'
                                : currentTab === 'my-documents' && isAssistantCoordinator
                                ? 'View and manage recorded documents'
                                : currentTab === 'approved-files'
                                ? 'View and manage all approved documents'
                                : currentTab === 'submitted-documents'
                                ? 'Review and manage submitted documents'
                                : 'Manage and organize your files efficiently'
                            }
                        </p>
                    </div>
                    {(currentTab === 'my-documents' || currentTab === 'all-records-documents' || currentTab === 'approved-files' || currentTab === 'submitted-documents') && (
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            {
                                (isCoordinator) && 
                                currentTab === 'my-documents' && (
                                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                        <a 
                                            className='flex items-center space-x-2'
                                            href={authenticatedDirector ? '/director/upload-document' : authenticatedManagement ? '/management/upload-document': ''}>
                                            <Upload className="w-4 h-4" />
                                            <span>Upload New Doc</span>
                                        </a>
                                    </button>
                                )
                            }
                        </div>
                    )}
                </div>
            </div>

            <NavigationTabs
                tabs={navTabs}
                activeTab={currentTab}
                onTabChange={handleTabChange}
            />

            <div className="px-6 py-6">
                {(currentTab === 'my-documents' || currentTab === 'all-records-documents' || currentTab === 'approved-files' || currentTab === 'submitted-documents') && (
                    <>
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Overview
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {fileCategories.map((category, index) => (  
                                    <button key={index}>
                                        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow transition-shadow cursor-pointer">
                                            <div className="flex items-center justify-between mb-3">
                                                <div
                                                    className={`w-16 h-12 ${category.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                                                    {category.icon}
                                                </div>
                                                <span className="text-2xl font-bold text-gray-900">
                                                    {category.count}
                                                </span>
                                            </div>
                                            <h3 className="font-medium text-gray-900">
                                                {category.name}
                                            </h3>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                {currentTab === 'monthly-todo' && (
                    <div className="space-y-6">

                        {monthlyTodoLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="text-gray-500">Loading monthlyTodo data...</div>
                            </div>
                        ) : monthlyTodoError ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="text-red-500">Error: {monthlyTodoError}</div>
                            </div>
                        ) : !hasMonthlyTodoDocuments && !hasMonthlyTodoRequirements ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="text-gray-500">No monthlyTodo data found</div>
                            </div>
                        ) : (
                            <>
                                <MonthlyTodoContent 
                                    submittedFiles={monthlyTodoDocuments} 
                                    requirements={monthlyTodoRequirements}
                                    userRole={userRole || 'coordinator'} 
                                />
                                <SubmittedFilesTable 
                                    submittedFiles={monthlyTodoDocuments} 
                                    userRole={userRole || 'coordinator'} 
                                />
                            </>
                        )}
                    </div>
                )}

                {(currentTab === 'my-documents' || currentTab === 'all-records-documents') && (
                    <div className="bg-white rounded-xl border border-gray-200">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Documents
                                </h2>
                                <div className="flex items-center space-x-3">
                                    <select
                                        value={selectedFilter}
                                        onChange={(e) =>
                                            setSelectedFilter(e.target.value)
                                        }
                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="all">All Categories</option>
                                        {/* Get unique categories from documents */}
                                        {Array.from(new Set(documentList?.map(doc => doc.category) || []))
                                            .filter(category => category).map(category => (
                                                <option key={category} value={category}>{category}</option>
                                            ))
                                        }
                                    </select>
                                    <div className="flex bg-gray-100 rounded-lg p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-md transition-colors ${
                                                viewMode === 'grid'
                                                    ? 'bg-white shadow-sm text-blue-600'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}>
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-md transition-colors ${
                                                viewMode === 'list'
                                                    ? 'bg-white shadow-sm text-blue-600'
                                                    : 'text-gray-500 hover:text-gray-700'
                                            }`}>
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {
                            filteredDocuments?.length > 0 ?
                                <div className="p-6">
                                    {viewMode === 'grid' ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {filteredDocuments.map((document) => (
                                                <DocumentCard
                                                    key={document.document_id}
                                                    selectedDocument={document}
                                                    onDeleteDocument={handleDeleteDocuments}
                                                    canDeleteDocument={canDeleteDocument}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedDocuments.length > 0 && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-blue-700 font-medium">
                                                            {selectedDocuments.length}{' '}
                                                            document(s) selected
                                                            {(isCoordinator || isStaff) && (
                                                                <span className="text-sm text-gray-600 ml-2">
                                                                    ({getDeletableDocuments(selectedDocuments).length} can be deleted)
                                                                </span>
                                                            )}
                                                        </span>
                                                        <div className="flex space-x-2">
                                                            <button
                                                            onClick={() => handleDownloadFile(selectedDocuments)}
                                                            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors">
                                                                Download
                                                            </button>
                                                            <button onClick={() => handleShareFile(selectedDocuments)}
                                                            className="px-3 py-1 bg-white text-blue-600 border border-blue-600 rounded-md text-sm hover:bg-blue-50 transition-colors">
                                                                Share
                                                            </button>
                                                            <button 
                                                            onClick={() => handleDeleteDocuments(selectedDocuments)}
                                                            disabled={getDeletableDocuments(selectedDocuments).length === 0}
                                                            className={`px-3 py-1 rounded-md text-sm transition-colors ${
                                                                getDeletableDocuments(selectedDocuments).length > 0
                                                                    ? 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                                                                    : 'bg-gray-100 text-gray-400 border border-gray-300 cursor-not-allowed'
                                                            }`}
                                                            title={getDeletableDocuments(selectedDocuments).length === 0 ? 'No documents can be deleted (all are approved)' : ''}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                            {filteredDocuments.map((document) => (
                                                <DocumentRow
                                                    key={document.document_id}
                                                    document={document}
                                                    selectedDocuments={selectedDocuments}
                                                    toggleDocumentSelection={toggleDocumentSelection}
                                                    canDeleteDocument={canDeleteDocument}
                                                    onDeleteDocument={handleDeleteDocuments}
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {filteredDocuments.length === 0 && (
                                        <div className="text-center py-12">
                                            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                                No documents found
                                            </h3>
                                            <p className="text-gray-500 mb-6">
                                                Try adjusting your search or filter criteria
                                            </p>
                                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                                Upload your first document
                                            </button>
                                        </div>
                                    )}
                            </div> : <div className='flex justify-center items-center p-6'>There's no file uploaded yet</div>
                        }
                    </div>
                )}
            </div>
            
        </div>
    );
};

export default ManageFiles;
