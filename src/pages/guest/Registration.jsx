import React, { useState } from 'react';
import { Upload, LogIn } from 'lucide-react';
import { asset } from '../../assets/asset';
import { useNavigate } from 'react-router-dom';
import extractImageId from '../../services/orcService'

const Registration = () => {
    const navigate = useNavigate()

    // image Proccessing State
    const [extractedText, setText] = React.useState('')
    const [isVerified, setVerified] = React.useState(false)
    const [isLoading, setLoading] = React.useState(false)

    const [formData, setFormData] = useState({
        studentId: '',
        firstName: '',
        lastName: '',
        middleName: '',
        department: '',
        courseAndYear: '',
        email: '',
        studentIdFile: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleStudentId = (e) => {
        const { name, value } = e.target;

        // this condition restrict the user to input any char string
        if (name === 'studentId' && /^\d*$/.test(value)) {
            return setFormData(prevState => ({
                ...prevState, [name]: value
            }))
        }
        return
    }

    const handleEmail = (e) => {
        const { name, value } = e.target

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (name === 'email' && emailRegex.test(value)) {
            setFormData(prevState => ({
                ...prevState, [name]: value.toLowerCase()
            }))
            return
        }

        return
    }

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        file ? setFormData(prevState => ({
            ...prevState,
            studentIdFile: URL.createObjectURL(file)
        })) : undefined
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if the file is provided
        if (!formData.studentIdFile) {
            document.querySelector('#asteriskSymbol').style.color = 'red';
            return; // Stop the function if no file is selected
        }

        // Start loading
        setLoading(true);

        try {
            // Extract text from the image
            const receiveFromExtract = await extractImageId(formData.studentIdFile);
            setText(receiveFromExtract);

            if (receiveFromExtract) {
                const studentName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`
                    .trim()
                    .toLowerCase();

                // Check if extracted text contains the name
                const isMatch = receiveFromExtract.toLowerCase().includes(studentName);
                setVerified(isMatch);

                console.log('Extracted text:', receiveFromExtract);
            } else {
                console.error('No text extracted from the image.');
                setVerified(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setVerified(false);
        } finally {
            // Stop loading after process
            setLoading(false);
        }
    };


    const handleNextPage = (e) => {
        e.preventDefault()
        return navigate('/')
    }

    return (
        <div className="min-h-screen">
            <nav className="bg-blue-600 text-white shadow-md sticky top-0 z[100]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-14">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center">
                                <img
                                    className="h-10 w-10 mr-3"
                                    src={asset.logo}
                                    alt="logo"
                                />
                                <span className="text-xl font-bold">UCLM CARES</span>
                            </div>
                        </div>
                        <div>
                            <button onClick={handleNextPage} className="flex items-center bg-white cursor-pointer text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300">
                                <LogIn className="mr-2 h-5 w-5" />
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Registration Form */}
            <div className="container mx-auto px-4 py-8 flex items-center justify-center">
                <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-8">
                    {/* <div className="statement flex justify-center">
                        <p className='text-[12px]'>University Of Cebu Lapu-lapu Mandaue</p>
                    </div> */}
                    <div className="logo flex justify-start">
                        <img src={asset.logo} alt='logo' className=' flex items-center h-12 w-12' />
                        <img src={asset.uclmLogo} alt='logo' className=' flex items-center h-12 w-12' />
                    </div>

                    <div className="header flex justify-center items-center pb-8">                        <h2 className="text-2xl flex font-bold text-gray-800 text-center">
                        Student Registration Form
                    </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Student ID Number *
                                </label>
                                <div className="errorCatcher">

                                </div>
                                <input
                                    type="text"
                                    id="studentId"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleStudentId}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md  focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleEmail}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                // required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-2">
                                    Middle Initial
                                </label>
                                <input
                                    type="text"
                                    id="middleName"
                                    name="middleName"
                                    value={formData.middleName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                                    Department *
                                </label>
                                <select
                                    id="department"
                                    name="department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select Department</option>
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Engineering">Engineering</option>
                                    <option value="Business">Business</option>
                                    <option value="Arts">Arts</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="courseAndYear" className="block text-sm font-medium text-gray-700 mb-2">
                                    Course & Year *
                                </label>
                                <input
                                    type="text"
                                    id="courseAndYear"
                                    name="courseAndYear"
                                    value={formData.courseAndYear}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {
                            formData.studentIdFile ?
                                <div className="imageContainer flex flex-col justify-center items-center">
                                    <div className="p-4 border-none bg-white rounded-md drop-shadow-2xl ">
                                        <img src={formData.studentIdFile}
                                            alt='Student ID Image'
                                            className='rounded-md h-[15rem]'
                                        />
                                    </div>
                                    <div className='absolute opacity-30'>
                                        <div className="flex items-center justify-center mt-4">
                                            <label className="flex flex-col items-center justify-center w-[26.6rem] h-[15rem] border-2 mb-4 border-gray-100 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors duration-300">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                                                    <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                                    <p className="mb-2 text-sm text-gray-500">
                                                        <span className="font-semibold">Click to Re Upload</span> or drag and drop
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, or PDF (MAX. 5MB)
                                                    </p>
                                                </div>
                                                <input
                                                    type="file"
                                                    id="studentIdUpload"
                                                    name="studentIdFile"
                                                    accept=".png,.jpg,.jpeg,.pdf"
                                                    onChange={handleFileUpload}
                                                    className="hidden required"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                : <div>
                                    <label id='labelUploadStudentID' htmlFor="studentIdUpload" className="block text-sm font-medium text-gray-700 mb-2">
                                        Upload Student ID <span id='asteriskSymbol'>*</span>
                                    </label>
                                    <div className="EmptyImageContainer flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                                <p className="mb-2 text-sm text-gray-500">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, or PDF (MAX. 5MB)
                                                </p>
                                            </div>
                                            <input
                                                type="file"
                                                id="studentIdUpload"
                                                name="studentIdFile"
                                                accept=".png,.jpg,.jpeg,.pdf"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>
                        }

                        <div className="text-center">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Registration;