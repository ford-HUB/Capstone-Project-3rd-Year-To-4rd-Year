import React, { useState } from "react";
import { Upload, LogIn } from "lucide-react";
import { asset } from "../../assets/asset";
import { useNavigate } from "react-router-dom";
import extractImageId from "../../services/orcService";
import CleanReGex from "../../utils/CleanReGex";
import OptionModal from "../../components/modal/OptionModal";
import Loader from "../../components/modal/Loader";
import { useDepartment } from "../../context/useDepartmentContext";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { departmentCourses } = useDepartment()
  // image Proccessing State
  const [isVerified, setVerified] = React.useState(false);
  const [isLoading, setLoading] = React.useState(false);

  // form submission State
  const [isSuccess, setSuccess] = React.useState(false);

  const [formData, setFormData] = useState({
    studentId: "",
    firstName: "",
    lastName: "",
    middleName: "",
    age: "",
    gender: "",
    department: "",
    course: "",
    year: "",
    email: "",
    studentIdFile: null,
  });

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
    file
      ? setFormData((prevState) => ({
          ...prevState,
          studentIdFile: URL.createObjectURL(file),
        }))
      : undefined;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if the file is provided
    if (!formData.studentIdFile) {
      document.querySelector("#asteriskSymbol").style.color = "red";
      document.querySelector("#errorMessage").style.display = "block";
      return; // Stop if no file is selected
    }

    // Start loading
    setLoading(true);

    try {
      // Extract text from the image
      const receiveFromExtract = await extractImageId(formData.studentIdFile);
      // @ Debugging
      console.log("Raw Extracted Data:", receiveFromExtract);

      // Check if extracted text is valid
      if (!receiveFromExtract || typeof receiveFromExtract !== "string") {
        console.error("No valid data extracted from the image.");
        setVerified(false);
        return;
      }

      // Clean the extracted text
      const cleanedText = CleanReGex(receiveFromExtract);
      // Get the student's full name and remove spacing and lowerCase
      const studentName =
        `${formData.firstName} ${formData.middleName} ${formData.lastName}`
          .trim()
          .toLowerCase();

      // Check if the cleaned extracted text contains the name
      if (cleanedText.toLowerCase().includes(studentName)) {
        setVerified(true);
        console.log("Student name verified successfully!");
        console.log(formData);
        setSuccess(true);
        setFormData({
          studentId: "",
          firstName: "",
          lastName: "",
          middleName: "",
          department: "",
          courseAndYear: "",
          email: "",
          studentIdFile: null,
        });
      } else {
        console.log("School Id does not match to your form data");
        setVerified(false);
        setSuccess(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setVerified(false);
    } finally {
      // Stop loading after process
      setLoading(false);
    }

    setInterval(() => {
      setSuccess(false);
    }, 2000);
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

      <div className="min-h-screen">
        <nav className="bg-blue-600 text-white shadow-md sticky top-0 z[100]">
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
            <div className="logo flex justify-start">
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
                    // required
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
                  <fieldset className="fieldset border-base-300 rounded-box w-64 border py-2 px-2 bg-white outline-none">
                  <label className="label">
                    <input
                    type="radio"
                    value={'M'}
                    onChange={formData.gender}
                    name="male"
                    className="radio text-gray-500"
                    defaultChecked/>
                    Male
                  </label>
                  <label className="label">
                    <input
                    type="radio"
                    value={'F'}
                    onChange={formData.gender}
                    name="male"
                    className="radio text-gray-500" />
                    Female
                  </label>
                </fieldset>
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
                    <option disabled value={''}>Select Department</option>
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
                    id="department"
                    name="department"
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
                    id="year"
                    name="year"
                    value={formData.year}
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
                      src={formData.studentIdFile}
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

export default SignUpPage;
