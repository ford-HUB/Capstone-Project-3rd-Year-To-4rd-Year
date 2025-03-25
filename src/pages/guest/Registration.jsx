import React, { useState } from 'react';
import { Upload, LogIn } from 'lucide-react';
import { asset } from '../../assets/asset';

const Registration = () => {
    const [formData, setFormData] = useState({
        studentId: '',
        firstName: '',
        lastName: '',
        suffix: '',
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

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setFormData(prevState => ({
            ...prevState,
            studentIdFile: file
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formData);
    };

    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav className="bg-blue-600 text-white shadow-md">
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
                            <button
                                className="flex items-center bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300"
                            >
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
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Student Registration Form
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                                    Student ID Number *
                                </label>
                                <input
                                    type="text"
                                    id="studentId"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleInputChange}
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
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
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
                                <label htmlFor="suffix" className="block text-sm font-medium text-gray-700 mb-2">
                                    Suffix
                                </label>
                                <input
                                    type="text"
                                    id="suffix"
                                    name="suffix"
                                    value={formData.suffix}
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
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="studentIdUpload" className="block text-sm font-medium text-gray-700 mb-2">
                                Upload Student ID *
                            </label>
                            <div className="flex items-center justify-center w-full">
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
                                        required
                                    />
                                </label>
                            </div>
                            {formData.studentIdFile && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Uploaded: {formData.studentIdFile.name}
                                </p>
                            )}
                        </div>

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