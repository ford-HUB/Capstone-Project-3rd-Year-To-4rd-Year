import React from 'react'
import { ChevronRight, Pencil, Plus, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { asset } from '../../assets/asset.jsx'
import { useAuthStore } from '../../store/director/useAuthStore.js'
import { useProfileStore } from '../../store/director/useProfileStore.js'
import { usePaymentStore } from '../../store/director/usePaymentStore.js'
import { GetFirstLetter } from '../../utils/GetFirstLetter.js'
import { usePaymentHandlers } from '../../hooks/usePaymentHandlers.js'
import EditDirectorInformationModal from '../../components/modal/EditDirectorInformationModal.jsx'
import EditDirectorAddressModal from '../../components/modal/EditDirectorAddressModal.jsx'
import PaymentFields from '../../components/modal/PaymentFields.jsx'
import PaymentSection from '../../components/director/PaymentSection.jsx'

const DirectorProfile = () => {
    // Modal states
    const [showEditPersonInfoModal, setShowEditPersonInfoModal] = React.useState(false)
    const [showEditPersonAddressModal, setShowEditPersonAddressModal] = React.useState(false)
    const [showPaymentFieldsModal, setShowPaymentFieldsModal] = React.useState(false)
    const [operationType, setOperationType] = React.useState()

    // Store hooks
    const { currentDirectorInfo, currentProfile, insertOrUpdateProfileInfo, insertOrUpdateProfileAddress } = useProfileStore()
    const { authenticatedDirector } = useAuthStore()
    const { paymentMethods, availableMethods, getPaymentMethods } = usePaymentStore()

    // Payment handlers hook
    const paymentHandlers = usePaymentHandlers()

    // Load data on mount
    React.useEffect(() => {
        let isMounted = true
        const fetchInfo = async () => {
            if (!currentDirectorInfo && isMounted) {
                try {
                    await currentProfile()
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
            if (paymentHandlers.activeDropdown && !event.target.closest('.dropdown-container')) {
                paymentHandlers.toggleDropdown(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [paymentHandlers.activeDropdown])

    // Profile handlers
    const handleCompleteAddOrEditPersonInfo = async (formData) => {
        let success
        switch (operationType) {
            case 'add':
            case 'edit':
                success = await insertOrUpdateProfileInfo(formData)
                break
            default:
                console.log('operation type is out of scope')
                break
        }
        if (!success) return
        await currentProfile()
        setShowEditPersonInfoModal(false)
    }

    const handleCompleteAddOrEditPersonAddress = async (formData) => {
        let success
        switch (operationType) {
            case 'add':
            case 'edit':
                success = await insertOrUpdateProfileAddress(formData)
                break
            default:
                console.log('operation type is out of scope')
                break
        }
        if (!success) return
        await currentProfile()
        setShowEditPersonAddressModal(false)
    }

    const handlePaymentFieldsComplete = async () => {
        try {
            await currentProfile()
            await getPaymentMethods()
        } catch (error) {
            console.error('Failed to refresh profile:', error)
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
                    {(!currentDirectorInfo || Object.keys(currentDirectorInfo).length === 0) && 
                        <div className='bg-red-50 rounded-xl py-2 px-5 flex items-center space-x-2.5'>
                            <TriangleAlert className='h-4 w-4 text-red-600'/>
                            <h1 className='text-red-600'>Please Update Your Profile First</h1>
                        </div>
                    }
                </div>

                {/* Profile Header */}
                <div className="profile-header border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4 inline-flex items-center">
                        {currentDirectorInfo.profile_image ? 
                            <img className='w-24 h-24 rounded-full avatar mx-3' src={currentDirectorInfo.profile_image} alt=""/> 
                            : <span className="text-white text-5xl font-medium w-24 h-24 bg-blue-600 rounded-full flex justify-center items-center">
                                {GetFirstLetter(currentDirectorInfo.firstname)}
                              </span>
                        }
                        <div className='mx-4 space-y-1.5'>
                            <h1 className='text-2xl font-semibold'>{`${currentDirectorInfo?.firstname || ''} ${currentDirectorInfo?.lastname || ''}`}</h1>
                            <div className="flex items-center space-x-2 text-gray-600">
                                <span className='text-sm'>{authenticatedDirector.Role.name ? 'Director' : 'Unauthorized Access'}</span>
                                <span className="w-px h-4 bg-gray-300"></span>
                                <span className='text-sm'>{currentDirectorInfo?.school}</span>
                            </div>
                        </div>
                    </div>

                    <div className='m-4 flex items-center space-x-6'>
                        <button 
                            onClick={() => {
                                setOperationType(currentDirectorInfo && currentDirectorInfo.firstname ? 'edit' : 'add')
                                setShowEditPersonInfoModal(true)
                            }}
                            className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl cursor-pointer'
                        >
                            {currentDirectorInfo && currentDirectorInfo.firstname ? 
                                <><Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit</>
                                : <><Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add</>
                            }
                        </button>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="personal-information border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4">
                        <h1 className='text-xl font-semibold m-3'>Personal Information</h1>
                        {currentDirectorInfo && currentDirectorInfo.firstname ? 
                            <>
                                <div className='mx-4 grid grid-cols-2 space-y-1.5 gap-16'>
                                    <div className='flex flex-col space-y-4'>
                                        <div className='flex flex-col'>
                                            <span className='text-[12px] text-gray-500'>First name</span>
                                            <span>{currentDirectorInfo.firstname}</span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-[12px] text-gray-500'>Email Address</span>
                                            <span>{currentDirectorInfo.email_address}</span>
                                        </div>
                                    </div>
                                    <div className='flex flex-col space-y-4'>
                                        <div className='flex flex-col'>
                                            <span className='text-[12px] text-gray-500'>Last name</span>
                                            <span>{currentDirectorInfo.lastname}</span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-[12px] text-gray-500'>Phone</span>
                                            <span>{currentDirectorInfo.phone_number}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='mx-4 flex flex-col mt-8'>
                                    <span className='text-[12px] text-gray-500 border-0'>Role</span>
                                    <span>{currentDirectorInfo.role}</span>
                                </div>
                            </> : null
                        }
                    </div>
                    <div className='m-4 flex items-center space-x-6'>
                        <button 
                            onClick={() => {
                                setOperationType(currentDirectorInfo && currentDirectorInfo.firstname ? 'edit': 'add')
                                setShowEditPersonInfoModal(true)
                            }}
                            className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl cursor-pointer'
                        >
                            {currentDirectorInfo && currentDirectorInfo.firstname ? 
                                <><Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit</>
                                : <><Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add</>
                            }
                        </button>
                    </div>
                </div>

                {/* Address Information */}
                <div className="address border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4">
                        <h1 className='text-xl font-semibold m-3'>Address</h1>
                        {currentDirectorInfo && currentDirectorInfo.province ?
                            <>
                                <div className='mx-4 grid grid-cols-2 space-y-1.5 gap-16'>
                                    <div className='flex flex-col space-y-4'>
                                        <div className='flex flex-col'>
                                            <span className='text-[12px] text-gray-500'>Province</span>
                                            <span>{currentDirectorInfo.province}</span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-[12px] text-gray-500'>Postal Code</span>
                                            <span>{currentDirectorInfo.postal_code}</span>
                                        </div>
                                    </div>
                                    <div className='flex flex-col space-y-4'>
                                        <div className='flex flex-col'>
                                            <span className='text-[12px] text-gray-500'>City</span>
                                            <span>{currentDirectorInfo.city}</span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-[12px] text-gray-500'>Barangay</span>
                                            <span>{currentDirectorInfo.brgy}</span>
                                        </div>
                                    </div>
                                </div>
                            </> : null
                        }
                    </div>
                    <div className='m-4 flex items-center space-x-6'>
                        <button 
                            onClick={() => {
                                setOperationType(currentDirectorInfo && currentDirectorInfo.province ? 'edit' : 'add')
                                setShowEditPersonAddressModal(true)
                            }}
                            className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl'
                        >
                            {currentDirectorInfo && currentDirectorInfo.province ? 
                                <><Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit</>
                                : <><Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add</>
                            }
                        </button>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="payment-gateway border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4 flex-1">
                        <PaymentSection
                            paymentMethods={paymentMethods}
                            availableMethods={availableMethods}
                            activeDropdown={paymentHandlers.activeDropdown}
                            showUpdatePaymentModal={paymentHandlers.showUpdatePaymentModal}
                            showRemovePaymentModal={paymentHandlers.showRemovePaymentModal}
                            selectedPaymentForUpdate={paymentHandlers.selectedPaymentForUpdate}
                            selectedPaymentForRemove={paymentHandlers.selectedPaymentForRemove}
                            onToggleDropdown={paymentHandlers.toggleDropdown}
                            onStatusUpdate={paymentHandlers.handlePaymentStatusUpdate}
                            onUpdateClick={paymentHandlers.handleUpdatePaymentClick}
                            onUpdateConfirm={paymentHandlers.handleUpdatePaymentConfirm}
                            onUpdateCancel={paymentHandlers.handleUpdatePaymentCancel}
                            onRemoveClick={paymentHandlers.handleRemovePaymentClick}
                            onRemoveConfirm={paymentHandlers.handleRemovePaymentConfirm}
                            onRemoveCancel={paymentHandlers.handleRemovePaymentCancel}
                            onAddPayment={handleAddPayment}
                        />
                    </div>
                </div>
            </main>

            {/* Modals */}
            <EditDirectorInformationModal
                open={showEditPersonInfoModal}
                setOpen={setShowEditPersonInfoModal}
                mode={operationType}
                currentInfo={currentDirectorInfo}
                onComplete={handleCompleteAddOrEditPersonInfo}
            />
            <EditDirectorAddressModal
                open={showEditPersonAddressModal}
                setOpen={setShowEditPersonAddressModal}
                mode={operationType}
                currentInfo={currentDirectorInfo}
                onComplete={handleCompleteAddOrEditPersonAddress}
            />
            <PaymentFields
                open={showPaymentFieldsModal}
                setOpen={setShowPaymentFieldsModal}
                onComplete={handlePaymentFieldsComplete}
            />
        </div>
    )
}

export default DirectorProfile
