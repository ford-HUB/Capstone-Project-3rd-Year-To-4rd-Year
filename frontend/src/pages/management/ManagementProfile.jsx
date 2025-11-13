import React from 'react'
import { ChevronRight, Pencil, Plus, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { asset } from '../../assets/asset.jsx'
import { useAuthStore } from '../../store/management/useAuthStore.js'
import { useProfileStore } from '../../store/management/useProfileStore.js'
import { GetFirstLetter } from '../../utils/GetFirstLetter.js'
import EditManagementInformationModal from '../../components/modal/EditManagementInformationModal.jsx'
import EditManagementAddressModal from '../../components/modal/EditManagementAddressModal.jsx'

const ManagementProfile = () => {
    const { authenticatedManagement } = useAuthStore()
    const { currentProfile, managementCurrentProfile, insertOrUpdateProfileInfo , insertOrUpdateProfileAddress} = useProfileStore()

    const [showEditPersonInfoModal, setShowEditPersonInfoModal] = React.useState(false)
    const [showEditPersonAddressModal, setShowEditPersonAddressModal] = React.useState(false)
    const [operationType, setOperationType] = React.useState()

    const handleCompleteEditPersonInfo = async(formData) => {
        switch(operationType) {
            case 'add':
                await insertOrUpdateProfileInfo(formData)
                await currentProfile()
                setShowEditPersonInfoModal(false)
                break
            case 'edit':
                    await insertOrUpdateProfileInfo(formData)
                    await currentProfile()
                    setShowEditPersonInfoModal(false)
                break
            default:
                console.log('operation type is out of scope')
                break
        }
    }

    const handleComppleteAddOrEditPersonAddress = async(formData) => {
        switch(operationType) {
            case 'add':
                await insertOrUpdateProfileAddress(formData)
                await currentProfile()
                setShowEditPersonAddressModal(false)
                break
            case 'edit':
                    await insertOrUpdateProfileAddress(formData)
                    await currentProfile()
                  setShowEditPersonAddressModal(false)
                break
            default:
                console.log('operation type is out of scope')
                break
        }
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
                    {
                        !managementCurrentProfile.firstname  && 
                        <div className='bg-red-50 rounded-xl py-2 px-5 flex items-center space-x-2.5'>
                        <TriangleAlert className='h-4 w-4 text-red-600'/>
                        <h1 className='text-red-600'>Please Update Your Profile.</h1>
                    </div>
                    }
                </div>

                <div className="profile-header border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4 inline-flex items-center">
                        {
                            managementCurrentProfile.profile_image ? 
                            <img className='w-24 h-24 rounded-full avatar mx-3' src={managementCurrentProfile.profile_image} alt="profile"/> 
                            : <span className="text-white text-5xl font-medium w-24 h-24 bg-blue-600 rounded-full flex justify-center items-center">{GetFirstLetter(managementCurrentProfile.firstname)}</span>
                        }
                        <div className='mx-4 space-y-1.5'>
                            <h1 className='text-2xl font-semibold'>{`${managementCurrentProfile.firstname || ''} ${managementCurrentProfile.lastname || ''}`}</h1>
                            <div className="flex items-center space-x-2 text-gray-600">
                                <span className='text-sm'>{authenticatedManagement?.Role.name === 'staff' ? 'Staff': authenticatedManagement.Role.name === 'coordinator' ? 'Coordinator': authenticatedManagement.Role.name === 'assistant_coordinator' ? 'Assistant Coordinator' : 'Unauthorized'}</span>
                                <span className="w-px h-4 bg-gray-300"></span>
                                <span className='text-sm'>{managementCurrentProfile?.Department?.department_name || 'CARES'}</span>
                            </div>
                        </div>
                    </div>

                    <div className='m-4 flex items-center space-x-6'>
                        <div className='inline-flex space-x-4.5'>
                            <img className='w-8 h-8' src={asset.facebookWB} alt=""/>
                            <img className='w-8 h-8' src={asset.insta} alt=""/>
                            <img className='w-8 h-8' src={asset.linkedIn} alt=""/>
                        </div>
                        <button onClick={() => {
                            setOperationType(managementCurrentProfile.firstname ? 'edit' : 'add')
                            setShowEditPersonInfoModal(true)
                            console.log(managementCurrentProfile)
                        }}
                        className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl cursor-pointer'>
                            { managementCurrentProfile.firstname ? 
                            <><Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit</>
                            : <><Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add</>   }
                        </button>
                    </div>
                </div>

                <div className="personal-information border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4">
                        <h1 className='text-xl font-semibold m-3'>Personal Information</h1>
                            {
                                managementCurrentProfile.firstname &&
                                <>
                                    <div className='mx-4 grid grid-cols-2 space-y-1.5 gap-16'>
                                    <div className='flex flex-col space-y-4'>
                                        <div className='flex flex-col'>
                                            <span className='text-[12px] text-gray-500'>First name</span>
                                            <span>{managementCurrentProfile.firstname || ''}</span>
                                        </div>
                                        <div className='flex flex-col'>
                                            <span className='text-[12px] text-gray-500'>Gender</span>
                                            <span>{authenticatedManagement.gender === 'M' ? 'Male' : 'Female'}</span>
                                        </div>

                                    </div>
                                        <div className='flex flex-col space-y-4'>
                                            <div className='flex flex-col'>
                                                <span className='text-[12px] text-gray-500'>Last name</span>
                                                <span>{managementCurrentProfile.lastname}</span>
                                            </div>
                                            <div className='flex flex-col'>
                                                <span className='text-[12px] text-gray-500'>Phone</span>
                                                <span>{managementCurrentProfile.phone_number}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mx-4 flex flex-col mt-8'>
                                        <span className='text-[12px] text-gray-500 border-0'>Bio</span>
                                        <span>{managementCurrentProfile.bio}</span>
                                    </div>
                                </>
                            }
                    </div>

                    <div className='m-4 flex items-center space-x-6'>
                        <button onClick={() => {
                            setOperationType(managementCurrentProfile.firstname ? 'edit' : 'add')
                            setShowEditPersonInfoModal(true)
                        }}
                        className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl cursor-pointer'>
                            { managementCurrentProfile.firstname ? 
                            <><Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit</>
                            : <><Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add</>   }
                        </button>
                    </div>
                </div>

                <div className="address border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4">
                        <h1 className='text-xl font-semibold m-3'>Address</h1>
                        {
                            managementCurrentProfile.province && 
                            <div className='mx-4 grid grid-cols-2 space-y-1.5 gap-16'>
                                <div className='flex flex-col space-y-4'>
                                    <div className='flex flex-col'>
                                        <span className='text-[12px] text-gray-500'>Province</span>
                                        <span>{managementCurrentProfile.province || ''}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-[12px] text-gray-500'>Postal Code</span>
                                        <span>{managementCurrentProfile.postal_code || ''}</span>
                                    </div>
                                </div>

                                <div className='flex flex-col space-y-4'>
                                    <div className='flex flex-col'>
                                        <span className='text-[12px] text-gray-500'>City</span>
                                        <span>{managementCurrentProfile.city || ''}</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-[12px] text-gray-500'>Barangay</span>
                                        <span>{managementCurrentProfile.brgy || ''}</span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>

                    <div className='m-4 flex items-center space-x-6'>
                        <button onClick={() => {
                            setOperationType(managementCurrentProfile.province ? 'edit' : 'add')
                            setShowEditPersonAddressModal(true)
                        }}
                        className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl'>
                            { managementCurrentProfile.province ? 
                            <><Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit</>
                            : <><Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add</>   }
                        </button>
                    </div>
                </div>

                {/* <div className="payment-gateway border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4">
                        <h1 className='text-xl font-semibold m-3'>Payment Available</h1>

                        <div className='mx-4 grid grid-cols-4 space-y-1.5 gap-16'>
                            <div className='flex flex-col space-y-4'>
                                <div className='flex flex-row items-center'>
                                    <img className='w-12 h-12 rounded-md' src={asset.gcash} alt="Gcash" />
                                    <div className='flex flex-col p-3'>
                                        <span className='text-[12px] text-gray-500'>Connected Number</span>
                                        <span className=''>+639812545735</span>
                                    </div>
                                </div>
                                <div className='flex flex-row items-center'>
                                    <img className='w-12 h-12 rounded-md ' src={asset.maya} alt="Gcash" />
                                    <div className='flex flex-col p-3'>
                                        <span className='text-[12px] text-gray-500'>Connected Number</span>
                                        <span className=''>+639812545735</span>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col space-y-4'>
                                <div className='flex flex-row items-center'>
                                    <img className='w-12 h-12 rounded-md' src={asset.paypal} alt="PayPal" />
                                    <div className='flex flex-col p-3'>
                                        <span className='text-[12px] text-gray-500'>Connected Number</span>
                                        <span className=''>+639812545735</span>
                                    </div>
                                </div>
                                <div className='flex flex-row items-center'>
                                    <img className='w-12 h-12 rounded-md ' src={asset.visa} alt="Visa" />
                                    <div className='flex flex-col p-3'>
                                        <span className='text-[12px] text-gray-500'>Connected Number</span>
                                        <span className=''>+639812545735</span>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col space-y-4'>
                                <div className='flex flex-row items-center'>
                                    <img className='w-12 h-12 rounded-md ' src={asset.mastercard} alt="MasterCard" />
                                    <div className='flex flex-col p-3'>
                                        <span className='text-[12px] text-gray-500'>Connected Number</span>
                                        <span className=''>+639812545735</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='m-4 flex items-center space-x-6'>
                        <button
                        className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl cursor-pointer'>
                            <Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit
                        </button>
                    </div>
                </div> */}
            </main>
            <EditManagementInformationModal
            open={showEditPersonInfoModal}
            setOpen={setShowEditPersonInfoModal}
            mode={operationType}
            onComplete={handleCompleteEditPersonInfo}
            currentInfo={managementCurrentProfile}
            />

            <EditManagementAddressModal
            open={showEditPersonAddressModal}
            setOpen={setShowEditPersonAddressModal}
            mode={operationType}
            onComplete={handleComppleteAddOrEditPersonAddress}
            currentInfo={managementCurrentProfile}
            />
        </div>
    )
}

export default ManagementProfile