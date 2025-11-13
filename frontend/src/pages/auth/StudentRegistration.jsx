import React from "react";
import { Upload, LogIn } from "lucide-react";
import { asset } from "../../assets/asset";
import { useNavigate } from "react-router-dom";
import extractImageId from "../../services/orcService";
import CleanReGex from "../../utils/CleanReGex";
import OptionModal from "../../components/modal/OptionModal";
import Loader from "../../components/modal/Loader";
import { useDepartment } from "../../context/useDepartmentContext";
import { useAuthStore } from "../../store/participant/useAuthStore";
import toast from "react-hot-toast";
import { signupSchema } from "../../forms/StudentSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import VerifyCode from "../../components/modal/VerifyCode";

const StudentRegistration = () => {
  const { signup } = useAuthStore();
  const { departmentCourses } = useDepartment();
  const navigate = useNavigate();

  const [openVerify, setVerify] = React.useState(() => {
    return localStorage.getItem('verifyModalOpen') === 'true'
  })
  
  // State for image processing and form submission
  const [isLoading, setLoading] = React.useState(false);
  const [preview, setPreview] = React.useState(null);

  const { 
    register, 
    handleSubmit, 
    watch, 
    setValue, 
    reset,
    formState: { errors, isSubmitting } 
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      studentId: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      middleName: "",
      age: undefined,
      gender: "",
      department: "",
      course: "",
      year_level: undefined,
      phoneNumber: "",
      currentAddress: "",
      studentIdFile: undefined
    }
  });

  const selectedDepartment = watch('department');

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size too large (max 5MB)");
        return;
      }
      
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        toast.error("Only JPG, JPEG, and PNG files are allowed");
        return;
      }

      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
      setValue('studentIdFile', file, { shouldValidate: true });
    }
  };

  const onSubmitForm = async (data) => {
    setLoading(true);
    try {
      const receiveFromExtract = await extractImageId(data.studentIdFile);
      console.log("Raw Extracted Data:", receiveFromExtract);

      if (!receiveFromExtract || typeof receiveFromExtract !== "string") {
        toast.error("Please Attach Your ID");
        return;
      }

      const cleanedText = await CleanReGex(receiveFromExtract);
      const studentName = `${data.firstName} ${data.middleName} ${data.lastName}`
        .trim()
        .toLowerCase();

      if (cleanedText.toLowerCase().includes(studentName)) {
        
        const formData = new FormData();
        formData.append('studentId', data.studentId);
        formData.append('email', data.email);
        formData.append('password', data.password);
        formData.append('confirmPassword', data.confirmPassword);
        formData.append('firstname', data.firstName);
        formData.append('lastname', data.lastName);
        formData.append('middlename', data.middleName);
        formData.append('age', data.age);
        formData.append('gender', data.gender);
        formData.append('phoneNumber', data.phoneNumber);
        formData.append('address', data.currentAddress);
        formData.append('department', data.department);
        formData.append('course', data.course);
        formData.append('yearLevel', data.yearLevel);
        formData.append('studentIdFile', data.studentIdFile, data.studentIdFile.name);

        // Debug Purposes
        console.log("FormData contents:");
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        const success = await signup(formData);
        if (success) {
          localStorage.setItem('verifyModalOpen', 'true')
          reset()
          setPreview(null)
          setVerify(true)
          return 
        }
      } else {
        toast.error("School ID does not match your provided information");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.errorMessage || "Registration failed");
    } finally {
      setLoading(false);
    }
  };


  React.useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);


  const [verification, setVerification] = React.useState(false)

  const handleVerification = () => {
    localStorage.removeItem('verifyModalOpen')
    setVerification(true)
    setVerify(false)
  }

  React.useEffect(() => {
    return () => {
      localStorage.removeItem('verifyModalOpen');
    };
  }, []);

  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, [])


  return (
    <>

      {
        isMounted && openVerify && <VerifyCode onVerificationComplete={handleVerification}/>
      }

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
                  className="flex items-center bg-white cursor-pointer text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 transition duration-300"
                  onClick={() => navigate('/')}
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
                  className="flex items-center h-12 w-12"
                />
                <img
                  src={asset.uclmLogo}
                  alt="logo"
                  className="flex items-center h-12 w-12 ml-2"
                />
              </div>
            </div>

            <div className="header flex justify-center items-center pb-8">
              <h2 className="text-2xl flex font-bold text-gray-800 text-center">
                Student Registration Form
              </h2>
            </div>

            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID Number *
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    {...register('studentId')}
                    className={`w-full px-3 py-2 border ${errors.studentId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.studentId && <p className="text-red-500 text-sm mt-1">{errors.studentId.message}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    {...register('password')}
                    className={`w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register('confirmPassword')}
                    className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
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
                    {...register('firstName')}
                    className={`w-full px-3 py-2 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...register('lastName')}
                    className={`w-full px-3 py-2 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                </div>

                <div>
                  <label htmlFor="middleName" className="block text-sm font-medium text-gray-700 mb-2">
                    Middle Initial
                  </label>
                  <input
                    type="text"
                    id="middleName"
                    {...register('middleName')}
                    className={`w-full px-3 py-2 border ${errors.middleName ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.middleName && <p className="text-red-500 text-sm mt-1">{errors.middleName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    {...register('phoneNumber')}
                    className={`w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
                </div>

                <div>
                  <label htmlFor="currentAddress" className="block text-sm font-medium text-gray-700 mb-2">
                    Current Address *
                  </label>
                  <input
                    type="text"
                    id="currentAddress"
                    {...register('currentAddress')}
                    className={`w-full px-3 py-2 border ${errors.currentAddress ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.currentAddress && <p className="text-red-500 text-sm mt-1">{errors.currentAddress.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="text"
                    id="age"
                    {...register('age', { valueAsNumber: true })}
                    className={`w-full px-3 py-2 border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
                </div>

                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    id="gender"
                    {...register('gender')}
                    className={`w-full px-3 py-2 border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="" disabled>Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                    Department *
                  </label>
                  
                  <select
                    id="department"
                    {...register('department')}
                    className={`w-full px-3 py-2 border ${errors.department ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select Department</option>
                    {Object.keys(departmentCourses).map((department) => (
                      <option key={department} value={department}>{department}</option>
                    ))}
                  </select>
                  {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
                </div>

                <div>
                  <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                    Course *
                  </label>
                  <select
                    id="course"
                    {...register('course')}
                    disabled={!selectedDepartment}
                    className={`w-full px-3 py-2 border ${errors.course ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="">Select Course</option>
                    {(departmentCourses[selectedDepartment] || []).map((course) => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                  {errors.course && <p className="text-red-500 text-sm mt-1">{errors.course.message}</p>}
                </div>

                <div>
                  <label htmlFor="yearLevel" className="block text-sm font-medium text-gray-700 mb-2">
                    Year *
                  </label>
                  <select
                    id="yearLevel"
                    {...register('yearLevel', {
                      setValueAs: (v) => v === '' ? undefined : Number(v)
                    })}
                    className={`w-full px-3 py-2 border ${errors.yearLevel ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  >
                    <option value="" disabled>Year Level</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                  {errors.yearLevel && <p className="text-red-500 text-sm mt-1">{errors.yearLevel.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="studentIdFile" className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Student ID *
                </label>
                {preview ? (
                  <div className="relative">
                    <div className="p-4 border-none bg-white rounded-md shadow-md">
                      <img
                        src={preview}
                        alt="Student ID Preview"
                        className="rounded-md h-60 w-full object-contain"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer bg-black/50 rounded-md">
                        <div className="flex flex-col items-center justify-center text-white">
                          <Upload className="w-10 h-10 mb-3" />
                          <p className="mb-2 text-sm">
                            <span className="font-semibold">Click to Re-upload</span>
                          </p>
                          <p className="text-xs">
                            PNG, JPG (MAX. 5MB)
                          </p>
                        </div>
                        <input
                          type="file"
                          id="studentIdFile"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-10 h-10 text-gray-400 mb-3" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      id="studentIdFile"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                )}
                {errors.studentIdFile && <p className="text-red-500 text-sm mt-1">{errors.studentIdFile.message}</p>}
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading || isSubmitting ? 'Registering...' : 'Register'}
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