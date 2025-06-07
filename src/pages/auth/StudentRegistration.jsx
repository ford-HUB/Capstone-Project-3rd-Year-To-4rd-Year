import React, { useEffect, useState } from "react";
import { Upload, LogIn } from "lucide-react";
import { asset } from "../../assets/asset";
import { useNavigate } from "react-router-dom";
import extractImageId from "../../services/orcService";
import CleanReGex from "../../utils/CleanReGex";
import OptionModal from "../../components/modal/OptionModal";
import Loader from "../../components/modal/Loader";
import { useDepartment } from "../../context/useDepartmentContext";
import { useAuth } from "../../hooks/participant/useAuth.js";
import toast from "react-hot-toast";
import StudentVerifyAccountPage from './StudentVerifyAccountPage';

const StudentRegistration = () => {
  const { signup } = useAuth()
  const navigate = useNavigate();
  const { departmentCourses } = useDepartment()
  
  // image Proccessing State
  const [isVerified, setVerified] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  // form submission State
  const [isSuccess, setSuccess] = React.useState(false);
  const [showOtpVerification, setShowOtpVerification] = React.useState(false);

  // Submtting action
  const [submitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    studentId: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    middleName: "",
    age: "",
    gender: "",
    department: "",
    course: "",
    yearLevel: "",
    phoneNumber: "",
    currentAddress: "",
    studentIdFile: undefined,
  });

  const [preview, setPreview] = useState(undefined)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleStudentId = (e) => {
    const { name, value } = e.target;

    // this condition restrict the user to input any char string
    if (name === "studentId" && /^\d*$/.test(value)) {
      return setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
    return;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    setFormData((prevState) => ({
          ...prevState,
          studentIdFile: file
        }))
    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);

    try {
      // Extract text from the image
      const receiveFromExtract = await extractImageId(formData.studentIdFile);
      console.log("Raw Extracted Data:", receiveFromExtract);

      if (!receiveFromExtract || typeof receiveFromExtract !== "string") {
        console.error("No valid data extracted from the image.");
        setVerified(false);
        toast.error("Could not extract text from your Student ID");
        return;
      }

      // Clean the extracted text
      const cleanedText = CleanReGex(receiveFromExtract);
      const studentName = `${formData.firstName} ${formData.middleName} ${formData.lastName}`
        .trim()
        .toLowerCase();

      if (cleanedText.toLowerCase().includes(studentName)) {
        setVerified(true);
        
        const data = new FormData();
        data.append('studentId', formData.studentId);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('confirmPassword', formData.confirmPassword);
        data.append('firstname', formData.firstName);
        data.append('lastname', formData.lastName);
        data.append('middlename', formData.middleName);
        data.append('age', formData.age);
        data.append('gender', formData.gender);
        data.append('phoneNumber', formData.phoneNumber);
        data.append('address', formData.currentAddress);
        data.append('department', formData.department);
        data.append('course', formData.course);
        data.append('yearLevel', formData.yearLevel);
        data.append('studentIdFile', formData.studentIdFile);

        const success = await signup(data);
        if (success) {
          setSuccess(true);
          setShowOtpVerification(true);
          toast.success("Registration successful! Please verify your email.");
        }
      } else {
        toast.error("School ID does not match your provided information");
        setVerified(false);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.errorMessage || "Registration failed");
      setVerified(false);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  const handleVerificationComplete = () => {
    setShowOtpVerification(false);
    navigate('/login');
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    return navigate("/");
  };

  return (
    <>
      <OptionModal open={isLoading} setOpen={isLoading}>
        <div className="loaderContainer flex justify-center items-center flex-col">
          <h1 className="mb-4 flex items-center justify-center">
            Verifying ID
          </h1>
          <div className="loader flex justify-center items-center">
            <Loader />
          </div>
        </div>
      </OptionModal>

      <OptionModal open={isSuccess} setOpen={setSuccess}>
        <div className="successContainer flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="flex pr-2 size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <h1 className="text-[14px]">Successfully Registered</h1>
        </div>
      </OptionModal>

      {showOtpVerification && (
        <StudentVerifyAccountPage 
          email={formData.email}
          onVerificationComplete={handleVerificationComplete}
        />
      )}

      <div className="min-h-screen">
        <nav className="bg-blue-600 text-white shadow-md sticky top-0 z[999]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center">
                  <img className="h-10 w-10 mr-3" src={asset.logo} alt="logo" />
                  <span className="text-xl font-bold">UCLM CARES</span>
                </div>
              </div>
              <div>
                <button
                  onClick={handleNextPage}
                  className="flex items-center bg-white cursor-pointer text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Login
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8 flex items-center justify-center bg-gray-100">
          <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-8">
            <div className="logo flex justify-between">
              <div className="flex">
                <img
                src={asset.logo}
                alt="logo"
                className=" flex items-center h-12 w-12"
              />
              <img
                src={asset.uclmLogo}
                alt="logo"
                className=" flex items-center h-12 w-12"
              />
              </div>
            </div>

            <div className="header flex justify-center items-center pb-8">
              {" "}
              <h2 className="text-2xl flex font-bold text-gray-800 text-center">
                Student Registration Form
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Student ID Number *
                  </label>
                  <div className="errorCatcher"></div>
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="Password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password *
                  </label>
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="Confirm Password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password *
                  </label>
                  <input
                    type="text"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                  <label
                    htmlFor="middleName"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                  <label
                    htmlFor="PhoneNuumber"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="currentAddress"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Current Address *
                  </label>
                  <input
                    type="text"
                    id="currentAddress"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="age"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Age
                  </label>
                  <input
                    type="text"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="gender"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                    <option value={''} disabled>Select Department</option>
                  {
                    Object.keys(departmentCourses).map((department) => (
                      <option key={department} value={department}>{department}</option>
                    ))
                  }

                  </select>
                </div>

                <div>
                  <label
                    htmlFor="department"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Course *
                  </label>
                  <select
                    id="course"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option disabled value={''}>Select Course</option>
                    {
                      (departmentCourses[formData.department] || []).map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))
                    }
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="courseAndYear"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Year *
                  </label>
                  <select
                    id="yearLevel"
                    name="yearLevel"
                    value={formData.yearLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option disabled value={''}>Year Level</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  
                  </select>
                </div>
              </div>

              {formData.studentIdFile ? (
                <div className="imageContainer flex flex-col justify-center items-center">
                  <div className="p-4 border-none bg-white rounded-md drop-shadow-2xl ">
                    <img
                      src={preview}
                      alt="Student ID Image"
                      className="rounded-md h-[15rem]"
                    />
                  </div>
                  <div className="absolute opacity-30">
                    <div className="flex items-center justify-center mt-4">
                      <label className="flex flex-col items-center justify-center w-[26.6rem] h-[15rem] border-2 mb-4 border-gray-100 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors duration-300">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                          <Upload className="w-10 h-10 text-gray-400 mb-3" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to Re Upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, or PDF (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          id="studentIdUpload"
                          name="studentIdFile"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden required"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label
                    id="labelUploadStudentID"
                    htmlFor="studentIdUpload"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Upload Student ID <span id="asteriskSymbol">*</span>
                  </label>
                  <div className="EmptyImageContainer flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG, or PDF (MAX. 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        id="studentIdUpload"
                        name="studentIdFile"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isLoading || isVerified}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentRegistration;
