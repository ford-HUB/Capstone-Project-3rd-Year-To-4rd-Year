import React, { useState } from 'react';
import { 
    Download, 
    Eye, 
    Search, 
    Filter, 
    Calendar,
    FileText,
    Receipt,
    CreditCard,
    CheckCircle,
    Clock,
    AlertCircle,
    X,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { asset } from '../../assets/asset.jsx';

const ReceiptsInvoices = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [limitPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);

    // Filter states
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        year: '2024',
        search_term: ''
    });

    // Static receipts data
    const receipts = [
        {
            id: 'RCP-2024-001',
            type: 'receipt',
            campaign: 'Build a Community Library',
            amount: 5000,
            date: '2024-10-15',
            status: 'completed',
            paymentMethod: 'GCash',
            transactionId: 'TXN-789456123',
            description: 'Donation for community library project',
            taxDeductible: true
        },
        {
            id: 'RCP-2024-002',
            type: 'receipt',
            campaign: 'Medical Mission for Rural Areas',
            amount: 2500,
            date: '2024-10-12',
            status: 'completed',
            paymentMethod: 'Visa',
            transactionId: 'TXN-456789123',
            description: 'Medical supplies and equipment donation',
            taxDeductible: true
        },
        {
            id: 'INV-2024-001',
            type: 'invoice',
            campaign: 'Typhoon Relief Fund',
            amount: 10000,
            date: '2024-10-08',
            status: 'pending',
            paymentMethod: 'PayMaya',
            transactionId: 'TXN-123456789',
            description: 'Emergency relief fund contribution',
            taxDeductible: true
        },
        {
            id: 'RCP-2024-003',
            type: 'receipt',
            campaign: 'Scholarship Program for Youth',
            amount: 7500,
            date: '2024-10-05',
            status: 'completed',
            paymentMethod: 'Mastercard',
            transactionId: 'TXN-987654321',
            description: 'Educational scholarship support',
            taxDeductible: true
        },
        {
            id: 'RCP-2024-004',
            type: 'receipt',
            campaign: 'Feeding Program for Seniors',
            amount: 1500,
            date: '2024-10-01',
            status: 'completed',
            paymentMethod: 'GCash',
            transactionId: 'TXN-147258369',
            description: 'Senior citizen feeding program',
            taxDeductible: true
        }
    ];

    const typeOptions = [
        { value: 'receipt', label: 'Receipt' },
        { value: 'invoice', label: 'Invoice' }
    ];

    const statusOptions = [
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'failed', label: 'Failed' }
    ];

    const yearOptions = ['2024', '2023', '2022'];

    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case 'Visa':
                return <img src={asset.visa} alt="Visa" className="w-4 h-3 object-contain" />;
            case 'Mastercard':
                return <img src={asset.mastercard} alt="Mastercard" className="w-4 h-3 object-contain" />;
            case 'GCash':
                return <img src={asset.gcash} alt="GCash" className="w-4 h-3 object-contain" />;
            case 'PayMaya':
                return <img src={asset.maya} alt="PayMaya" className="w-4 h-3 object-contain" />;
            default:
                return <CreditCard className="w-4 h-3 text-gray-600" />;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'failed':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return <Clock className="w-4 h-4 text-gray-600" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filter and search functionality
    const filteredReceipts = receipts.filter(receipt => {
        const matchesSearch = receipt.campaign.toLowerCase().includes(filters.search_term.toLowerCase()) ||
                            receipt.id.toLowerCase().includes(filters.search_term.toLowerCase()) ||
                            receipt.transactionId.toLowerCase().includes(filters.search_term.toLowerCase());
        
        let matchesType = true;
        if (filters.type) matchesType = receipt.type === filters.type;
        
        let matchesStatus = true;
        if (filters.status) matchesStatus = receipt.status === filters.status;
        
        return matchesSearch && matchesType && matchesStatus;
    });

    const totalAmount = filteredReceipts.reduce((sum, receipt) => sum + receipt.amount, 0);
    const completedReceipts = filteredReceipts.filter(r => r.status === 'completed').length;
    const pendingReceipts = filteredReceipts.filter(r => r.status === 'pending').length;
    const totalRecords = filteredReceipts.length;

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handleSearchChange = (value) => {
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            const newFilters = { ...filters, search_term: value };
            setFilters(newFilters);
            setCurrentPage(1);
        }, 500);

        setSearchTimeout(timeout);
    };

    const clearFilters = () => {
        const clearedFilters = {
            type: '',
            status: '',
            year: '2024',
            search_term: ''
        };
        setFilters(clearedFilters);
        setCurrentPage(1);
    };

    const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== '2024');

    const handleDownload = (receiptId) => {
        console.log('Downloading receipt:', receiptId);
        // In a real app, this would trigger a download
    };

    const handleView = (receiptId) => {
        console.log('Viewing receipt:', receiptId);
        // In a real app, this would open a receipt viewer
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Receipts & Invoices</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        View and download your donation receipts and invoices
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                        {hasActiveFilters && (
                            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                                {Object.values(filters).filter(v => v !== '' && v !== '2024').length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-green-600">Completed</p>
                            <p className="text-2xl font-bold text-green-900">{completedReceipts}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <Clock className="w-8 h-8 text-yellow-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-yellow-600">Pending</p>
                            <p className="text-2xl font-bold text-yellow-900">{pendingReceipts}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <Receipt className="w-8 h-8 text-blue-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-blue-600">Total Records</p>
                            <p className="text-2xl font-bold text-blue-900">{totalRecords}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <FileText className="w-8 h-8 text-purple-600" />
                        <div className="ml-3">
                            <p className="text-sm font-medium text-purple-600">Total Amount</p>
                            <p className="text-2xl font-bold text-purple-900">₱{totalAmount.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                                <span>Clear All</span>
                            </button>
                        )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by ID, campaign, or transaction..."
                                    value={filters.search_term}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">All Types</option>
                                {typeOptions.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">All Status</option>
                                {statusOptions.map(status => (
                                    <option key={status.value} value={status.value}>{status.label}</option>
                                ))}
                            </select>
                        </div>

                        {/* Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <select
                                value={filters.year}
                                onChange={(e) => handleFilterChange('year', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                {yearOptions.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <span className="ml-2 text-gray-600">Loading...</span>
                </div>
            )}

            {/* Table */}
            {!loading && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Document
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Campaign
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {filteredReceipts.map((receipt) => (
                                <tr key={receipt.id} className="hover:bg-gray-50">
                                    {/* Document */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                                                {receipt.type === 'receipt' ? (
                                                    <Receipt className="w-5 h-5 text-white" />
                                                ) : (
                                                    <FileText className="w-5 h-5 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{receipt.id}</div>
                                                <div className="text-xs text-gray-500">{receipt.transactionId}</div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Campaign */}
                                    <td className="py-4 px-6">
                                        <div className="text-sm font-medium text-gray-900">{receipt.campaign}</div>
                                        <div className="text-xs text-gray-500">{receipt.description}</div>
                                    </td>

                                    {/* Amount */}
                                    <td className="py-4 px-6">
                                        <div className="text-sm font-bold text-gray-900">₱{receipt.amount.toLocaleString()}</div>
                                        {receipt.taxDeductible && (
                                            <div className="text-xs text-green-600">Tax Deductible</div>
                                        )}
                                    </td>

                                    {/* Payment Method */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <div className="w-6 h-4 bg-white border border-gray-200 rounded flex items-center justify-center p-1 mr-2">
                                                {getPaymentMethodIcon(receipt.paymentMethod)}
                                            </div>
                                            <span className="text-sm text-gray-900">{receipt.paymentMethod}</span>
                                        </div>
                                    </td>

                                    {/* Date */}
                                    <td className="py-4 px-6 text-sm text-gray-900">
                                        {new Date(receipt.date).toLocaleDateString()}
                                    </td>

                                    {/* Status */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(receipt.status)}`}>
                                                {getStatusIcon(receipt.status)}
                                                <span className="ml-1">{receipt.status}</span>
                                            </span>
                                        </div>
                                    </td>

                                    {/* Actions */}
                                    <td className="py-4 px-6">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => handleView(receipt.id)}
                                                className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(receipt.id)}
                                                className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                                                title="Download"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {/* Empty State */}
                    {filteredReceipts.length === 0 && (
                        <div className="text-center py-12">
                            <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No receipts found</h3>
                            <p className="text-gray-600">
                                {hasActiveFilters 
                                    ? "Try adjusting your filters to see more results." 
                                    : "No receipts have been generated yet."
                                }
                            </p>
                            {hasActiveFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="mt-3 px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {!loading && filteredReceipts.length > 0 && (
                <div className="flex justify-between items-center mt-6">
                    <div className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * limitPerPage) + 1} to {Math.min(currentPage * limitPerPage, totalRecords)} of {totalRecords} records
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm text-gray-600 px-3">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 text-sm bg-gray-100 rounded-lg disabled:opacity-50 hover:bg-gray-200 transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReceiptsInvoices;