import React, { useState } from 'react';
import { 
    CreditCard, 
    Plus, 
    Edit, 
    Trash2, 
    Shield, 
    CheckCircle, 
    AlertCircle,
    Smartphone,
    Building,
    Wallet
} from 'lucide-react';
import { asset } from '../../assets/asset.jsx';

const PaymentMethods = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(null);

    // Static payment methods data
    const paymentMethods = [
        {
            id: 1,
            type: 'card',
            name: 'Visa **** 1234',
            brand: 'Visa',
            lastFour: '1234',
            expiryDate: '12/25',
            isDefault: true,
            status: 'active'
        },
        {
            id: 2,
            type: 'card',
            name: 'Mastercard **** 5678',
            brand: 'Mastercard',
            lastFour: '5678',
            expiryDate: '08/26',
            isDefault: false,
            status: 'active'
        },
        {
            id: 3,
            type: 'gcash',
            name: 'GCash - 0917 123 4567',
            brand: 'GCash',
            lastFour: '4567',
            expiryDate: null,
            isDefault: false,
            status: 'active'
        },
        {
            id: 4,
            type: 'paymaya',
            name: 'PayMaya - 0918 987 6543',
            brand: 'PayMaya',
            lastFour: '6543',
            expiryDate: null,
            isDefault: false,
            status: 'active'
        }
    ];

    const getCardIcon = (brand) => {
        switch (brand) {
            case 'Visa':
                return <img src={asset.visa} alt="Visa" className="w-6 h-4 object-contain" />;
            case 'Mastercard':
                return <img src={asset.mastercard} alt="Mastercard" className="w-6 h-4 object-contain" />;
            case 'GCash':
                return <img src={asset.gcash} alt="GCash" className="w-6 h-4 object-contain" />;
            case 'PayMaya':
                return <img src={asset.maya} alt="PayMaya" className="w-6 h-4 object-contain" />;
            default:
                return <CreditCard className="w-6 h-4 text-gray-600" />;
        }
    };

    const getCardColor = (brand) => {
        switch (brand) {
            case 'Visa':
                return 'from-blue-500 to-blue-600';
            case 'Mastercard':
                return 'from-red-500 to-orange-500';
            case 'GCash':
                return 'from-green-500 to-green-600';
            case 'PayMaya':
                return 'from-purple-500 to-purple-600';
            default:
                return 'from-gray-500 to-gray-600';
        }
    };

    const handleSetDefault = (id) => {
        // In a real app, this would make an API call
        console.log('Setting default payment method:', id);
    };

    const handleDelete = (id) => {
        // In a real app, this would make an API call
        console.log('Deleting payment method:', id);
        setShowDeleteModal(null);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Methods</h1>
                            <p className="text-gray-600">Manage your payment methods for donations</p>
                        </div>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center gap-2 shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Add Payment Method
                        </button>
                    </div>
                </div>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                    <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-1">Secure Payment Processing</h3>
                            <p className="text-sm text-blue-700">
                                Your payment information is encrypted and secure. We never store your full card details.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Methods Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {paymentMethods.map((method) => (
                        <div
                            key={method.id}
                            className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition-all duration-300 hover:shadow-lg ${
                                method.isDefault ? 'border-purple-200 bg-purple-50' : 'border-gray-200'
                            }`}
                        >
                            {/* Card Header */}
                            <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center p-1">
                                    {getCardIcon(method.brand)}
                                </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{method.name}</h3>
                                        {method.expiryDate && (
                                            <p className="text-sm text-gray-500">Expires {method.expiryDate}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {method.isDefault && (
                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">
                                            Default
                                        </span>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setEditingCard(method)}
                                            className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteModal(method.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Card Status */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="text-sm text-green-600 font-medium">Active</span>
                                </div>
                                {!method.isDefault && (
                                    <button
                                        onClick={() => handleSetDefault(method.id)}
                                        className="text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
                                    >
                                        Set as Default
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-8 h-6 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                                <img src={asset.visa} alt="Credit Card" className="w-5 h-3 object-contain" />
                            </div>
                            <div className="text-left">
                                <div className="font-medium text-gray-900">Add Credit Card</div>
                                <div className="text-sm text-gray-500">Visa, Mastercard, etc.</div>
                            </div>
                        </button>
                        <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-8 h-6 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                                <img src={asset.gcash} alt="GCash" className="w-5 h-3 object-contain" />
                            </div>
                            <div className="text-left">
                                <div className="font-medium text-gray-900">Add GCash</div>
                                <div className="text-sm text-gray-500">Mobile wallet payment</div>
                            </div>
                        </button>
                        <button className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                            <div className="w-8 h-6 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                                <img src={asset.maya} alt="PayMaya" className="w-5 h-3 object-contain" />
                            </div>
                            <div className="text-left">
                                <div className="font-medium text-gray-900">Add PayMaya</div>
                                <div className="text-sm text-gray-500">Mobile wallet payment</div>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Payment Security Info */}
                <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Security</h3>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>256-bit SSL encryption</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>PCI DSS compliant</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>No card details stored</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Payment Method Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-gray-900">Add Payment Method</h2>
                            <p className="text-gray-600 mt-1">Choose your preferred payment method</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-8 h-6 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                                    <img src={asset.visa} alt="Credit Card" className="w-5 h-3 object-contain" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">Credit/Debit Card</div>
                                    <div className="text-sm text-gray-500">Visa, Mastercard, American Express</div>
                                </div>
                            </button>
                            <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-8 h-6 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                                    <img src={asset.gcash} alt="GCash" className="w-5 h-3 object-contain" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">GCash</div>
                                    <div className="text-sm text-gray-500">Mobile wallet payment</div>
                                </div>
                            </button>
                            <button className="w-full flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                                <div className="w-8 h-6 bg-white border border-gray-200 rounded flex items-center justify-center p-1">
                                    <img src={asset.maya} alt="PayMaya" className="w-5 h-3 object-contain" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900">PayMaya</div>
                                    <div className="text-sm text-gray-500">Mobile wallet payment</div>
                                </div>
                            </button>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Delete Payment Method</h2>
                                    <p className="text-gray-600">This action cannot be undone</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                Are you sure you want to delete this payment method? You won't be able to use it for future donations.
                            </p>
                        </div>
                        <div className="p-6 border-t border-gray-200 flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(null)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteModal)}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethods;
