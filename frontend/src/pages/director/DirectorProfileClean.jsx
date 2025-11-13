import React from 'react'
import { ChevronRight, Pencil } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '../../store/director/useAuthStore.js'
import { useProfileStore } from '../../store/director/useProfileStore.js'
import { usePaymentStore } from '../../store/director/usePaymentStore.js'
import { GetFirstLetter } from '../../utils/GetFirstLetter.js'
import EditDirectorInformationModal from '../../components/modal/EditDirectorInformationModal.jsx'
import EditDirectorAddressModal from '../../components/modal/EditDirectorAddressModal.jsx'
import PaymentFields from '../../components/modal/PaymentFields.jsx'
import PaymentSection from '../../components/director/PaymentSection.jsx'

const DirectorProfile = () => {
    // Modal states
    const [showEditPersonInfoModal, setShowEditPersonInfoModal] = React.useState(false)
    const [showEditPersonAddressModal, setShowEditPersonAddressModal] = React.useState(false)
    const [showPaymentFieldsModal, setShowPaymentFieldsModal] = React.useState(false)
    const [showUpdatePaymentModal, setShowUpdatePaymentModal] = React.useState(false)
    const [showRemovePaymentModal, setShowRemovePaymentModal] = React.useState(false)
    
    // Payment states
    const [activeDropdown, setActiveDropdown] = React.useState(null)
    const [selectedPaymentForUpdate, setSelectedPaymentForUpdate] = React.useState(null)
    const [selectedPaymentForRemove, setSelectedPaymentForRemove] = React.useState(null)

    // Store hooks
    const { currentDirectorInfo, currentPaymentInfo, currentProfile, insertOrUpdateProfileInfo, insertOrUpdateProfileAddress } = useProfileStore()
    const { authenticatedDirector } = useAuthStore()
    const { paymentMethods, availableMethods, getPaymentMethods, updatePaymentStatus, removePaymentMethod, updatePaymentMethod } = usePaymentStore()

    // Load data on mount
    React.useEffect(() => {
        let isMounted = true
        const fetchInfo = async () => {
            if (!currentDirectorInfo && isMounted) {
                try {
                    await insertOrUpdateProfileInfo()
                } catch (error) {
                    console.error('Failed to refresh profile:', error)
                }
            }
        }
        fetchInfo()
        return () => {
            isMounted = false
        }
    }, [])

    React.useEffect(() => {
        getPaymentMethods()
    }, [])

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeDropdown && !event.target.closest('.dropdown-container')) {
                setActiveDropdown(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [activeDropdown])

    // Payment handlers
    const handlePaymentStatusUpdate = async (paymentId, status) => {
        if (!paymentId || paymentId === 'undefined') return
        const success = await updatePaymentStatus(paymentId, status)
        if (success) {
            setActiveDropdown(null)
        }
    }

    const handleUpdatePaymentClick = (payment) => {
        setSelectedPaymentForUpdate(payment)
        setShowUpdatePaymentModal(true)
        setActiveDropdown(null)
    }

    const handleUpdatePaymentConfirm = async () => {
        setShowUpdatePaymentModal(false)
        
        const paymentMethodType = selectedPaymentForUpdate?.payment_method_types?.[0]
        const finalPaymentId = selectedPaymentForUpdate?.linked_payment_account_id || 
                             selectedPaymentForUpdate?.id || 
                             selectedPaymentForUpdate?.payment_id || 
                             selectedPaymentForUpdate?.paymentId
        
        if (paymentMethodType) {
            const result = await updatePaymentMethod([paymentMethodType], finalPaymentId || null)
            if (result && result.success) {
                setSelectedPaymentForUpdate(null)
            }
        }
        setSelectedPaymentForUpdate(null)
    }

    const handleUpdatePaymentCancel = () => {
        setShowUpdatePaymentModal(false)
        setSelectedPaymentForUpdate(null)
    }

    const handleRemovePaymentClick = (payment) => {
        setSelectedPaymentForRemove(payment)
        setShowRemovePaymentModal(true)
        setActiveDropdown(null)
    }

    const handleRemovePaymentConfirm = async () => {
        if (selectedPaymentForRemove) {
            const paymentId = selectedPaymentForRemove.linked_payment_account_id || 
                            selectedPaymentForRemove.id || 
                            selectedPaymentForRemove.payment_id
            
            const success = await removePaymentMethod(paymentId)
            if (success) {
                setShowRemovePaymentModal(false)
                setSelectedPaymentForRemove(null)
            }
        }
    }

    const handleRemovePaymentCancel = () => {
        setShowRemovePaymentModal(false)
        setSelectedPaymentForRemove(null)
    }

    const toggleDropdown = (paymentId) => {
        if (activeDropdown === paymentId) {
            setActiveDropdown(null)
        } else {
            setActiveDropdown(paymentId)
        }
    }

    const handleAddPayment = () => {
        setShowPaymentFieldsModal(true)
    }

    return (
        <div className='flex flex-col h-screen mx-8 my-4'>
            <header className='flex flex-row justify-between items-center p-4'>
                <h1 className='text-gray-700 text-xl'>Profile</h1>
                <div className="info-block flex space-x-2.5">
                    <Link to={'/director'} className='text-gray-500'>Home</Link>
                    <ChevronRight size={18} className='relative top-0.5'/>
                    <span>Profile</span>
                </div>
            </header>

            <main className='bg-white border h-auto border-gray-300 rounded-xl w-full flex flex-col my-4'>
                <div className="title p-6 flex justify-between items-center">
                    <h1>Profile</h1>
                    <button
                        onClick={() => setShowEditPersonInfoModal(true)}
                        className='flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
                    >
                        <Pencil className='w-4 h-4' />
                        <span>Edit Profile</span>
                    </button>
                </div>

                <div className='px-6 pb-6 space-y-6'>
                    {/* Personal Information */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Personal Information</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='text-sm font-medium text-gray-600'>Full Name</label>
                                <p className='text-gray-900'>{currentDirectorInfo?.full_name || 'N/A'}</p>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-gray-600'>Email</label>
                                <p className='text-gray-900'>{currentDirectorInfo?.email || 'N/A'}</p>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-gray-600'>Phone Number</label>
                                <p className='text-gray-900'>{currentDirectorInfo?.phone_number || 'N/A'}</p>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-gray-600'>Birth Date</label>
                                <p className='text-gray-900'>{currentDirectorInfo?.birth_date || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className='bg-gray-50 p-4 rounded-lg'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='text-lg font-semibold text-gray-800'>Address Information</h3>
                            <button
                                onClick={() => setShowEditPersonAddressModal(true)}
                                className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                            >
                                Edit Address
                            </button>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div>
                                <label className='text-sm font-medium text-gray-600'>Street Address</label>
                                <p className='text-gray-900'>{currentDirectorInfo?.street_address || 'N/A'}</p>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-gray-600'>City</label>
                                <p className='text-gray-900'>{currentDirectorInfo?.city || 'N/A'}</p>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-gray-600'>State/Province</label>
                                <p className='text-gray-900'>{currentDirectorInfo?.state_province || 'N/A'}</p>
                            </div>
                            <div>
                                <label className='text-sm font-medium text-gray-600'>Postal Code</label>
                                <p className='text-gray-900'>{currentDirectorInfo?.postal_code || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <PaymentSection
                        paymentMethods={paymentMethods}
                        availableMethods={availableMethods}
                        activeDropdown={activeDropdown}
                        showUpdatePaymentModal={showUpdatePaymentModal}
                        showRemovePaymentModal={showRemovePaymentModal}
                        selectedPaymentForUpdate={selectedPaymentForUpdate}
                        selectedPaymentForRemove={selectedPaymentForRemove}
                        onToggleDropdown={toggleDropdown}
                        onStatusUpdate={handlePaymentStatusUpdate}
                        onUpdateClick={handleUpdatePaymentClick}
                        onUpdateConfirm={handleUpdatePaymentConfirm}
                        onUpdateCancel={handleUpdatePaymentCancel}
                        onRemoveClick={handleRemovePaymentClick}
                        onRemoveConfirm={handleRemovePaymentConfirm}
                        onRemoveCancel={handleRemovePaymentCancel}
                        onAddPayment={handleAddPayment}
                    />
                </div>
            </main>

            {/* Modals */}
            <EditDirectorInformationModal
                isOpen={showEditPersonInfoModal}
                onClose={() => setShowEditPersonInfoModal(false)}
            />
            <EditDirectorAddressModal
                isOpen={showEditPersonAddressModal}
                onClose={() => setShowEditPersonAddressModal(false)}
            />
            <PaymentFields
                isOpen={showPaymentFieldsModal}
                onClose={() => setShowPaymentFieldsModal(false)}
            />
        </div>
    )
}

export default DirectorProfile
