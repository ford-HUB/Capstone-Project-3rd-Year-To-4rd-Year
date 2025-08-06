import React from 'react'
import { ChevronRight, Pencil, Plus, TriangleAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { asset } from '../../assets/asset.jsx'
import EditDirectorInformationModal from '../../components/modal/EditDirectorInformationModal.jsx'
import EditDirectorAddressModal from '../../components/modal/EditDirectorAddressModal.jsx'
import PaymentFields from '../../components/modal/PaymentFields.jsx'
import { GetFirstLetter } from '../../utils/GetFirstLetter.js'
import EditStaffInformationModal from '../../components/modal/EditStaffInformationModal.jsx'

const StaffProfile = () => {
    const [showEditPersonInfoModal, setShowEditPersonInfoModal] = React.useState(false)

    const [showEditPersonAddressModal, setShowEditPersonAddressModal] = React.useState(false)
    const [showPaymentFieldsModal, setPaymentFieldsModal] = React.useState(false)
    const [operationType, setOperationType] = React.useState()

    const handleCompleteEditPersonInfo = async(formData) => {
        switch(operationType) {
            case 'add':
                setShowEditPersonInfoModal(false)
                break
            case 'edit':
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
                setShowEditPersonAddressModal(false)
                break
            case 'edit':
                  setShowEditPersonAddressModal(false)
                break
            default:
                console.log('operation type is out of scope')
                break
        }
    }

    const handlePaymentFieldsComplete = () => {

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
                    {/* {
                        currentDirectorInfo.length === 0 && currentPaymentInfo.length === 0 && 
                        <div className='bg-red-50 rounded-xl py-2 px-5 flex items-center space-x-2.5'>
                        <TriangleAlert className='h-4 w-4 text-red-600'/>
                        <h1 className='text-red-600'>Please Update Your Profile.</h1>
                    </div>
                    } */}
                </div>

                <div className="profile-header border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4 inline-flex items-center">
                        {/* {
                            currentDirectorInfo.profile_image ? 
                            <img className='w-24 h-24 rounded-full avatar mx-3' src={`https://img.daisyui.com/images/profile/demo/yellingcat@192.webp`} alt=""/> 
                            : <span className="text-white text-5xl font-medium w-24 h-24 bg-blue-600 rounded-full flex justify-center items-center">C</span>
                        } */}
                        <img className='w-24 h-24 rounded-full avatar mx-3' src={`https://img.daisyui.com/images/profile/demo/yellingcat@192.webp`} alt=""/> 
                        <div className='mx-4 space-y-1.5'>
                            <h1 className='text-2xl font-semibold'>Cris Dyford Bonghanoy</h1>
                            <div className="flex items-center space-x-2 text-gray-600">
                                <span className='text-sm'>Staff</span>
                                <span className="w-px h-4 bg-gray-300"></span>
                                <span className='text-sm'>UCLM CARES</span>
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
                            setOperationType('add')
                            setShowEditPersonInfoModal(true)
                        }}
                        className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl cursor-pointer'>
                            {/* { currentDirectorInfo.firstname ? 
                            <><Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit</>
                            : <><Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add</>   } */}
                            <Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add
                        </button>
                    </div>
                </div>

                <div className="personal-information border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4">
                        <h1 className='text-xl font-semibold m-3'>Personal Information</h1>
                            <div className='mx-4 grid grid-cols-2 space-y-1.5 gap-16'>
                                <div className='flex flex-col space-y-4'>
                                    <div className='flex flex-col'>
                                        <span className='text-[12px] text-gray-500'>First name</span>
                                        <span>Cris Dyford</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-[12px] text-gray-500'>Email Address</span>
                                        <span>Basak, Lapu-lapu City</span>
                                    </div>
                                </div>

                                <div className='flex flex-col space-y-4'>
                                    <div className='flex flex-col'>
                                        <span className='text-[12px] text-gray-500'>Last name</span>
                                        <span>Bonghanoy</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <span className='text-[12px] text-gray-500'>Phone</span>
                                        <span>09812545735</span>
                                    </div>
                                </div>
                            </div>
                        <div className='mx-4 flex flex-col mt-8'>
                            <span className='text-[12px] text-gray-500 border-0'>Role</span>
                            <span>Staff</span>
                        </div>
                    </div>

                    <div className='m-4 flex items-center space-x-6'>
                        <button onClick={() => {
                            setOperationType('add')
                            setShowEditPersonInfoModal(true)
                        }}
                        className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl cursor-pointer'>
                            {/* { currentDirectorInfo.firstname ? 
                            <><Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit</>
                            : <><Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add</>   } */}
                            <Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add
                        </button>
                    </div>
                </div>

                <div className="address border border-gray-300 rounded-xl m-4 flex justify-between">
                    <div className="m-4">
                        <h1 className='text-xl font-semibold m-3'>Address</h1>
                            <div className='mx-4 grid grid-cols-2 space-y-1.5 gap-16'>
                            <div className='flex flex-col space-y-4'>
                                <div className='flex flex-col'>
                                    <span className='text-[12px] text-gray-500'>Province</span>
                                    <span>Cebu</span>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-[12px] text-gray-500'>Postal Code</span>
                                    <span>6315</span>
                                </div>
                            </div>

                            <div className='flex flex-col space-y-4'>
                                <div className='flex flex-col'>
                                    <span className='text-[12px] text-gray-500'>City</span>
                                    <span>Lapu-lapu City</span>
                                </div>
                                <div className='flex flex-col'>
                                    <span className='text-[12px] text-gray-500'>Barangay</span>
                                    <span>Basak</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='m-4 flex items-center space-x-6'>
                        <button onClick={() => {
                            setShowEditPersonAddressModal(true)
                        }}
                        className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl'>
                            {/* { currentDirectorInfo.province ? 
                            <><Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit</>
                            : <><Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add</>   } */}
                            <Plus className='h-3.5 w-3.5 font-bold relative right-1.5'/>Add
                        </button>
                    </div>
                </div>

                <div className="payment-gateway border border-gray-300 rounded-xl m-4 flex justify-between">
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
                        <button onClick={() => setPaymentFieldsModal(true)}
                        className='flex items-center m-4 border border-gray-400 px-6 py-2.5 rounded-3xl cursor-pointer'>
                            <Pencil className='h-3.5 w-3.5 font-bold relative right-1.5'/> Edit
                        </button>
                    </div>
                </div>
            </main>
            <EditStaffInformationModal
            open={showEditPersonInfoModal}
            setOpen={setShowEditPersonInfoModal}
            onComplete={handleCompleteEditPersonInfo}
            currentInfo={null}
            />
        </div>
    )
}

export default StaffProfile