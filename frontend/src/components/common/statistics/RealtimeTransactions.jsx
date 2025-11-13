import React, { useEffect } from 'react';
import { Clock, DollarSign, Package, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { useRealtimeTransactionStore } from '../../../store/common/useRealtimeTransactionStore';

const RealtimeTransactions = () => {
    const { 
        transactions, 
        isConnected,
        loading,
        fetchInitialTransactions 
    } = useRealtimeTransactionStore();

    useEffect(() => {
        // Fetch initial transactions on component mount
        if (transactions.length === 0) {
            fetchInitialTransactions();
        }
    }, []);

    const formatCurrency = (amount) => {
        const numAmount = parseFloat(amount) || 0;
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numAmount);
    };

    const formatDateTime = (date) => {
        if (!date) return 'N/A';
        return dayjs(date).format('MMM DD, YYYY hh:mm:ss A');
    };

    const getStatusBadge = (status) => {
        const statusUpper = (status || '').toUpperCase();
        const badges = {
            'PENDING': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
            'RECEIVED': { color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
            'DISTRIBUTED': { color: 'bg-purple-100 text-purple-800', icon: CheckCircle },
            'COMPLETED': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
            'FAILED': { color: 'bg-red-100 text-red-800', icon: XCircle },
            'PAID': { color: 'bg-green-100 text-green-800', icon: CheckCircle }
        };

        const badge = badges[statusUpper] || badges['PENDING'];
        const Icon = badge.icon;

        return (
            <button className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                <Icon className="w-3 h-3" />
                {statusUpper}
            </button>
        );
    };


    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-900">All Transactions</h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                        <span className="text-xs text-gray-500">{isConnected ? 'Live' : 'Connecting...'}</span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="p-6">
                {transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No transactions found</p>
                        <p className="text-sm text-gray-400 mt-1">
                            New donations will appear here in real-time
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Donor Name</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date/Time</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Ref ID</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Order No</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Goods/Amount</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                {transaction.type === 'MONEY' ? (
                                                    <DollarSign className="w-4 h-4 text-green-600" />
                                                ) : (
                                                    <Package className="w-4 h-4 text-blue-600" />
                                                )}
                                                <span className="text-sm text-gray-900">{transaction.donor_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-700">{formatDateTime(transaction.timestamp)}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-700 font-mono">
                                                {transaction.donation_id || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-700 font-mono">
                                                {transaction.transaction_id || transaction.donation_id || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-gray-700 font-medium">
                                                {transaction.type === 'MONEY' ? 'Money' : 'Goods'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {transaction.type === 'MONEY' ? (
                                                <span className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(transaction.amount)}
                                                </span>
                                            ) : (
                                                <div className="text-sm text-gray-700">
                                                    <div className="font-medium">{transaction.goods_description || 'Goods Donation'}</div>
                                                    {transaction.goods_quantity && (
                                                        <div className="text-xs text-gray-500 mt-0.5">Qty: {transaction.goods_quantity}</div>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {getStatusBadge(transaction.status)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RealtimeTransactions;

