import React from 'react'
import { ChevronRight, Pencil, Plus, TriangleAlert, MoreVertical, Edit, Trash2, Power, PowerOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { asset } from '../../assets/asset.jsx'
import EditDirectorInformationModal from '../../components/modal/EditDirectorInformationModal.jsx'
import EditDirectorAddressModal from '../../components/modal/EditDirectorAddressModal.jsx'
import PaymentFields from '../../components/modal/PaymentFields.jsx'
import RemovePaymentModal from '../../components/modal/RemovePaymentModal.jsx'
import UpdatePaymentModal from '../../components/modal/UpdatePaymentModal.jsx'
import { useAuthStore } from '../../store/director/useAuthStore.js'
import { useProfileStore } from '../../store/director/useProfileStore.js'
import { usePaymentStore } from '../../store/director/usePaymentStore.js'
import { GetFirstLetter } from '../../utils/GetFirstLetter.js'
import { getPaymentIcon, getPaymentDisplayName } from '../../constants/paymentConstants.js'
import dayjs from 'dayjs'

const DirectorProfile = () => {
    const [showEditPersonInfoModal, setShowEditPersonInfoModal] = React.useState(false)
    const [showEditPersonAddressModal, setShowEditPersonAddressModal] = React.useState(false)
    const [showPaymentFieldsModal, setPaymentFieldsModal] = React.useState(false)
    const [showUpdatePaymentModal, setShowUpdatePaymentModal] = React.useState(false)
    const [showRemovePaymentModal, setShowRemovePaymentModal] = React.useState(false)
    const [operationType, setOperationType] = React.useState()
    const [activeDropdown, setActiveDropdown] = React.useState(null)
    const [selectedPaymentForUpdate, setSelectedPaymentForUpdate] = React.useState(null)
    const [selectedPaymentForRemove, setSelectedPaymentForRemove] = React.useState(null)

    const { currentDirectorInfo, currentPaymentInfo, currentProfile, insertOrUpdateProfileInfo, insertOrUpdateProfileAddress } = useProfileStore()
    const { authenticatedDirector } = useAuthStore()
    const { paymentMethods, availableMethods, getPaymentMethods, updatePaymentStatus, removePaymentMethod, updatePaymentMethod } = usePaymentStore()

    React.useEffect(() => {
        let isMounted = true
        const fetchInfo = async () => {
            // Only fetch if we don't have director info yet
            if(currentDirectorInfo && Object.keys(currentDirectorInfo).length > 0) return
                try {
                    await currentProfile()
                }catch(error){
                    if (isMounted) {
                    console.error("Fetch error:", error);
                }
            }
        }

        fetchInfo()

        return () => {
            isMounted = false
        }

    }, []) // Remove dependencies to prevent unnecessary re-renders

    // Load payment methods on component mount
    React.useEffect(() => {
        getPaymentMethods()
    }, [])


    const handleCompleteAddOrEditPersonInfo = async(formData) => {
        let success

        switch(operationType) {
            case 'add':
            case 'edit':
                success = await insertOrUpdateProfileInfo(formData)
                break
            default:
                console.log('operation type is out of scope')
                break
        }

        if(!success) return

        await currentProfile()
        setShowEditPersonInfoModal(false)
    }

    const handleComppleteAddOrEditPersonAddress = async(formData) => {
        let success
        switch(operationType) {
            case 'add':
            case 'edit':
                success = await insertOrUpdateProfileAddress(formData)
                break
            default:
                console.log('operation type is out of scope')
                break
        }

        if(!success) return

        await currentProfile()
        setShowEditPersonAddressModal(false)
    }

    const handlePaymentFieldsComplete = async () => {
        // Refresh payment info after successful payment setup
        try {
            await currentProfile()
            await getPaymentMethods()
        } catch (error) {
            console.error('Failed to refresh profile:', error)
        }
    }

    const handlePaymentStatusUpdate = async (paymentId, status) => {
        if (!paymentId || paymentId === 'undefined') {
            return
        }
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
        console.log('handleUpdatePaymentConfirm called');
        console.log('selectedPaymentForUpdate:', selectedPaymentForUpdate);
        console.log('selectedPaymentForUpdate keys:', Object.keys(selectedPaymentForUpdate || {}));
        console.log('updatePaymentMethod function:', typeof updatePaymentMethod);
        
        setShowUpdatePaymentModal(false)
        
        // Get the payment method type from the selected payment
        const paymentMethodType = selectedPaymentForUpdate?.payment_method_types?.[0];
        
        console.log('paymentMethodType:', paymentMethodType);
        console.log('paymentId:', selectedPaymentForUpdate?.id);
        console.log('Full payment object structure:', JSON.stringify(selectedPaymentForUpdate, null, 2));
        
        // Try different possible field names for payment method type
        const alternativePaymentType = selectedPaymentForUpdate?.payment_method_type || 
                                     selectedPaymentForUpdate?.type || 
                                     selectedPaymentForUpdate?.method;
        
        console.log('Alternative payment type:', alternativePaymentType);
        
        const finalPaymentType = paymentMethodType || alternativePaymentType;
        const finalPaymentId = selectedPaymentForUpdate?.id || 
                             selectedPaymentForUpdate?.payment_id || 
                             selectedPaymentForUpdate?.paymentId ||
                             selectedPaymentForUpdate?.ID ||
                             selectedPaymentForUpdate?.Id;
        
        console.log('Final payment type:', finalPaymentType);
        console.log('Final payment ID:', finalPaymentId);
        console.log('All possible ID fields:', {
            id: selectedPaymentForUpdate?.id,
            payment_id: selectedPaymentForUpdate?.payment_id,
            paymentId: selectedPaymentForUpdate?.paymentId,
            ID: selectedPaymentForUpdate?.ID,
            Id: selectedPaymentForUpdate?.Id
        });
        
        // If no ID found, we can still proceed without it for now
        if (finalPaymentType) {
            try {
                console.log('Calling updatePaymentMethod...');
                // Use the new update payment method with the specific payment ID (or null if not found)
                const result = await updatePaymentMethod([finalPaymentType], finalPaymentId || null);
                
                console.log('Update payment result:', result);
                
                if (result.success && result.checkout_url) {
                    console.log('Redirecting to:', result.checkout_url);
                    // Redirect to PayMongo checkout for the specific payment method
                    window.location.href = result.checkout_url;
                } else {
                    console.error('Update payment failed:', result);
                }
            } catch (error) {
                console.error('Update payment error:', error);
            }
        } else {
            console.error('Missing payment method type:', {
                paymentMethodType: finalPaymentType,
                paymentId: finalPaymentId,
                allFields: Object.keys(selectedPaymentForUpdate || {}),
                fullObject: selectedPaymentForUpdate
            });
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
        setActiveDropdown(null) // Close dropdown
    }

    const handleRemovePaymentConfirm = async () => {
        if (selectedPaymentForRemove) {
            try {
                // Use linked_payment_account_id as the primary ID for removal
                const paymentId = selectedPaymentForRemove.linked_payment_account_id || 
                                selectedPaymentForRemove.id || 
                                selectedPaymentForRemove.payment_id;
                
                const success = await removePaymentMethod(paymentId)
                
                if (success) {
                    setShowRemovePaymentModal(false)
                    setSelectedPaymentForRemove(null)
                    currentProfile()
                }
            } catch (error) {
                console.error('Remove payment failed:', error)
            }
        }
    }

    const handleRemovePaymentCancel = () => {
        setShowRemovePaymentModal(false)
        setSelectedPaymentForRemove(null)
    }

    const toggleDropdown = (paymentId) => {
        // If clicking the same dropdown, close it. If clicking a different one, open it.
        if (activeDropdown === paymentId) {
            setActiveDropdown(null)
        } else {
            setActiveDropdown(paymentId)
        }
    }

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
                    {
                        (!currentDirectorInfo || Object.keys(currentDirectorInfo).length === 0) && 
                        <div className='bg-red-50 rounded-xl py-2 px-5 flex items-center space-x-2.5'>
                        <TriangleAlert className='h-4 w-4 text-red-600'/>
                        <h1 className='text-red-600'>Please Update Your Profile First</h1>
                    </div>
                    }
                </div>

                <div className="profile-header border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4 inline-flex items-center">
                        {
                            currentDirectorInfo.profile_image ? 
                            <img className='w-24 h-24 rounded-full avatar mx-3' src={currentDirectorInfo.profile_image} alt=""/> 
                            : <span className="text-white text-5xl font-medium w-24 h-24 bg-blue-600 rounded-full flex justify-center items-center">{GetFirstLetter(currentDirectorInfo.firstname)}</span>
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
                        <button onClick={() => {
                            setOperationType(currentDirectorInfo && currentDirectorInfo.firstname ? 'edit' : 'add')
                            setShowEditPersonInfoModal(true)
                        }}
                        className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl cursor-pointer'>
                            { currentDirectorInfo && currentDirectorInfo.firstname ? 
                            <><Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit</>
                            : <><Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add</>   }
                        </button>
                    </div>
                </div>

                <div className="personal-information border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4">
                        <h1 className='text-xl font-semibold m-3'>Personal Information</h1>

                        {
                            currentDirectorInfo && currentDirectorInfo.firstname ? 
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
                        </>: null
                        }
                    </div>

                    <div className='m-4 flex items-center space-x-6'>
                        <button onClick={() => {
                            setOperationType(currentDirectorInfo && currentDirectorInfo.firstname ? 'edit': 'add')
                            setShowEditPersonInfoModal(true)
                        }}
                        className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl cursor-pointer'>
                            { currentDirectorInfo && currentDirectorInfo.firstname ? 
                            <><Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit</>
                            : <><Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add</>   }
                        </button>
                    </div>
                </div>

                <div className="address border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4">
                        <h1 className='text-xl font-semibold m-3'>Address</h1>

                        {
                            currentDirectorInfo && currentDirectorInfo.province ?
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
                        </>: null
                        }
                    </div>

                    <div className='m-4 flex items-center space-x-6'>
                        <button onClick={() => {
                            setOperationType(currentDirectorInfo && currentDirectorInfo.province ? 'edit' : 'add')
                            setShowEditPersonAddressModal(true)
                        }}
                        className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl'>
                            { currentDirectorInfo && currentDirectorInfo.province ? 
                            <><Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit</>
                            : <><Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add</>   }
                        </button>
                    </div>
                </div>

                <div className="payment-gateway border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4 flex-1">
                        <h1 className='text-xl font-semibold m-3'>Payment Methods</h1>

                        {(currentPaymentInfo && currentPaymentInfo.length > 0) || (paymentMethods && paymentMethods.length > 0) ? (
                            <div className='mx-4'>
                                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                                    {(paymentMethods.length > 0 ? paymentMethods : currentPaymentInfo).map((payment, index) => {
                                        const paymentType = payment.payment_method_types?.[0];
                                        

                                        const uniqueId = payment.id ? `payment-${payment.id}` : `payment-${index}-${paymentType}`;
                                        return (
                                            <div key={uniqueId} className='flex items-center p-4 bg-green-50 border border-green-200 rounded-lg relative'>
                                                <div className='w-12 h-12 rounded-md bg-white flex items-center justify-center shadow-sm mr-3'>
                                                    <img 
                                                        className='w-8 h-8 object-contain' 
                                                        src={getPaymentIcon(paymentType, asset)} 
                                                        alt={getPaymentDisplayName(paymentType)} 
                                                    />
                                                </div>
                                                <div className='flex-1'>
                                                    <span className='text-sm font-medium text-green-800'>
                                                        {getPaymentDisplayName(paymentType)}
                                                    </span>
                                                    <p className='text-xs text-green-600'>
                                                        {payment.status === 'ACTIVE' ? 'Active' : payment.status || 'Pending'}
                                                    </p>
                                                    {payment.updatedAt && (
                                                        <p className='text-xs text-gray-500 mt-1'>
                                                            Updated: {dayjs(payment.updatedAt).format('MMM DD, YYYY [at] h:mm A')}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className='flex items-center space-x-2'>
                                                    <div className={`w-3 h-3 rounded-full ${
                                                        payment.status === 'ACTIVE' ? 'bg-green-500' : 
                                                        payment.status === 'INACTIVE' ? 'bg-gray-500' : 'bg-yellow-500'
                                                    }`}></div>
                                                    
                                                    {/* 3-dot menu */}
                                                    <div className='relative dropdown-container'>
                                                        <button
                                                            onClick={() => toggleDropdown(uniqueId)}
                                                            className='p-1 hover:bg-gray-200 rounded-full transition-colors'
                                                        >
                                                            <MoreVertical className='w-4 h-4 text-gray-600' />
                                                        </button>
                                                        
                                                        {activeDropdown === uniqueId && (
                                                            <div className='absolute right-0 bottom-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[160px]' key={`dropdown-${uniqueId}`}>
                                                                <div className='py-1'>
                                                                    {/* Status Actions */}
                                                                    {payment.status !== 'ACTIVE' && (
                                                                        <button
                                                                            onClick={() => handlePaymentStatusUpdate(payment.linked_payment_account_id || payment.id, 'ACTIVE')}
                                                                            className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                                                        >
                                                                            <Power className='w-4 h-4 mr-2 text-green-600' />
                                                                            Set Active
                                                                        </button>
                                                                    )}
                                                                    {payment.status !== 'INACTIVE' && (
                                                                        <button
                                                                            onClick={() => handlePaymentStatusUpdate(payment.linked_payment_account_id || payment.id, 'INACTIVE')}
                                                                            className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                                                        >
                                                                            <PowerOff className='w-4 h-4 mr-2 text-gray-600' />
                                                                            Set Inactive
                                                                        </button>
                                                                    )}
                                                                    
                                                                    <div className='border-t border-gray-200 my-1'></div>
                                                                    
                                                                    {/* Update and Remove Actions */}
                                                                    <button
                                                                        onClick={() => handleUpdatePaymentClick(payment)}
                                                                        className='flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                                                                    >
                                                                        <Edit className='w-4 h-4 mr-2 text-blue-600' />
                                                                        Update
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleRemovePaymentClick(payment)}
                                                                        className='flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                                                                    >
                                                                        <Trash2 className='w-4 h-4 mr-2' />
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : (
                            <div className='mx-4 p-6 bg-gray-50 border border-gray-200 rounded-lg text-center'>
                                <div className='w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <span className='text-2xl text-gray-400'>💳</span>
                                </div>
                                <h3 className='text-lg font-medium text-gray-700 mb-2'>No Payment Methods Set Up</h3>
                                <p className='text-sm text-gray-500 mb-4'>
                                    Set up your payment methods to receive donations from participants.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className='m-4 flex items-center space-x-6'>
                        {/* Check if all required payment methods are added (3 is the fixed number) */}
                        {(availableMethods && availableMethods.length === 0) || (paymentMethods && paymentMethods.length >= 3) || (currentPaymentInfo && currentPaymentInfo.length >= 3) ? (
                            <></>
                        ) : (
                            <button 
                                onClick={() => setPaymentFieldsModal(true)}
                                className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl cursor-pointer hover:bg-gray-50 transition-colors'
                            >
                                {currentPaymentInfo && currentPaymentInfo.length > 0 ? (
                                    <>
                                        <Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> 
                                        Add More
                                    </>
                                ) : (
                                    <>
                                        <Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/> 
                                        Set Up Payment
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </main>
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
            onComplete={handleComppleteAddOrEditPersonAddress}
            />

            <PaymentFields
            open={showPaymentFieldsModal}
            setOpen={setPaymentFieldsModal}
            onComplete={handlePaymentFieldsComplete}
            />

            <UpdatePaymentModal
                open={showUpdatePaymentModal}
                setOpen={setShowUpdatePaymentModal}
                selectedPayment={selectedPaymentForUpdate}
                onConfirm={handleUpdatePaymentConfirm}
                onCancel={handleUpdatePaymentCancel}
            />

            <RemovePaymentModal
                open={showRemovePaymentModal}
                setOpen={setShowRemovePaymentModal}
                selectedPayment={selectedPaymentForRemove}
                onConfirm={handleRemovePaymentConfirm}
                onCancel={handleRemovePaymentCancel}
            />
        </div>
    )
}

export default DirectorProfile