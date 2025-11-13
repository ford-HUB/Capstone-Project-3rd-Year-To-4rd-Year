import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileInfoSchema } from "../../forms/managementSchema.js";
import { useAuthStore } from "../../store/management/useAuthStore.js";
import { useProfileStore } from "../../store/management/useProfileStore.js";
import { CircleX } from "lucide-react";
import SignatureUpload from '../common/SignatureUpload.jsx';

const EditManagementInformationModal = ({
  open,
  setOpen,
  mode,
  currentInfo,
  onComplete,
}) => {
  const isEdit = mode === "edit";
  const { authenticatedManagement } = useAuthStore();
  const { updateSignature } = useProfileStore()
  const [selectedSignature, setSelectedSignature] = React.useState(null);
  const [signaturePreview, setSignaturePreview] = React.useState(null);
  const [isUploadingSignature, setIsUploadingSignature] = React.useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileInfoSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      middle_initial: "",
      gender: "",
      email_address: "",
      phone_number: "",
      bio: "",
      department: "",
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        firstname: isEdit ? currentInfo.firstname : '',
        lastname: isEdit ? currentInfo.lastname : '',
        middle_initial: isEdit ? currentInfo.middle_initial : '',
        email_address: isEdit ? authenticatedManagement?.Role?.name === 'staff' ? currentInfo.email_address : '' : '',
        phone_number: isEdit ? currentInfo.phone_number : '',
        bio: isEdit ? currentInfo.bio : '',
        department : isEdit ? authenticatedManagement.Role.name === 'coordinator' || authenticatedManagement.Role.name === 'assistant_coordinator' ? currentInfo?.Department?.department_name : '' : currentInfo?.Department?.department_name
      })
      
      // Set signature preview if editing and signature exists
      if (isEdit && currentInfo.signature_img) {
        setSignaturePreview(currentInfo.signature_img);
        // Don't set selectedSignature to null here - we want to show the existing signature
      } else {
        setSignaturePreview(null);
        setSelectedSignature(null);
      }
    }
  }, [open, currentInfo, isEdit, reset]);

  const handleSignatureSelect = (file) => {
    setSelectedSignature(file);
    const reader = new FileReader();
    reader.onload = (e) => setSignaturePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleSignatureRemove = () => {
    setSelectedSignature(null);
    setSignaturePreview(null);
  };

  const handleFormSubmit = async (formData) => {
    // First handle the main form data
    await onComplete(formData);
    
    // Then handle signature upload if a new signature is selected
    if (selectedSignature) {
      setIsUploadingSignature(true);
      try {
        const signatureFormData = new FormData();
        signatureFormData.append('signature', selectedSignature);
        
        // Import the store function here to avoid circular dependency
        
        
        await updateSignature(signatureFormData);
      } catch (error) {
        console.error('Signature upload failed:', error);
      } finally {
        setIsUploadingSignature(false);
      }
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="flex flex-col sticky top-0 py-3">
          <div className="inline-flex items-center justify-between mb-4">
            <h1 className="font-semibold text-2xl">
              {isEdit
                ? "Edit Personal Information"
                : "Add Personal Information"}
            </h1>
            <button
              onClick={() => setOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-800"
            >
              <CircleX className="relative top-0 h-10 w-10 cursor-pointer" />
            </button>
          </div>
          <span className="text-sm text-gray-500">
            Update your details to keep your profile up to date.
          </span>
        </header>

        <main className="overflow-y-auto pr-1">
          <form onSubmit={handleSubmit(handleFormSubmit, (errors) =>
          console.log('found errors: ', errors)
          )}>
            <div className="subHeader2">
              <h2 className="text-xl mt-7 font-semibold text-gray-700">
                Personal Information
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6 mt-5">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="firstname">First name</label>
                <input 
                className="input w-full"
                type="text"
                name="firstname"
                {...register('firstname')  }
                />
                {errors.firstname && <span className='text-sm text-red-600'>{errors.firstname.message}</span>  }
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="lastname">Last name</label>
                <input
                className="input w-full"
                type="text"
                name="lastname"
                {...register('lastname')  }
                />
                {errors.lastname && <span className='text-sm text-red-600'>{errors.lastname.message}</span>  }
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="middle_initial">Middle Initial</label>
                <input 
                className="input w-full"
                type="text"
                name="middle_initial"
                {...register('middle_initial')  }
                />
                {errors.middle_initial && <span className='text-sm text-red-600'>{errors.middle_initial.message}</span>  }
              </div>
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="gender">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:border-none focus:ring-2 focus:ring-blue-500`}
                  {...register('gender')  }
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
                  {errors.gender && <span className='text-sm text-red-600'>{errors.gender.message}</span>  }
              </div>
              {
                currentInfo?.Department &&
                <div className="flex flex-col space-y-1.5">
                  <label htmlFor="department">Department</label>
                  <input
                    className="input w-full"
                    type="text"
                    name="department"
                    disabled  
                    {...register('department')  }
                  />
                </div>
              }

              {
                authenticatedManagement?.Role?.name === 'staff' ?
                <>
                  <div className="flex flex-col space-y-1.5">
                    <label htmlFor="email_address">Email Address</label>
                    <input
                      className="input w-full"
                      type="text"
                      name="email_address"
                      {...register('email_address')  }
                    />
                  </div>
                </> : <input type="hidden" value="" {...register('email_address')} />
              }
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="phone_number">Phone</label>
                <input
                  className="input w-full"
                  type="text"
                  name="phone_number"
                  {...register('phone_number')  }
                />
                  {errors.phone_number && <span className='text-sm text-red-600'>{errors.phone_number.message}</span>  }
              </div>
            </div>

            <div className="mt-4 flex flex-col space-y-2.5">
              <div className="flex flex-col">
                <label htmlFor="bio">Bio</label>
                <input
                  className="input w-full"
                  type="text"
                  name="bio"
                  {...register('bio')  }
                />
                  {errors.bio && <span className='text-sm text-red-600'>{errors.bio.message}</span>  }
              </div>
            </div>

            <div className="mt-4 flex flex-col space-y-2.5">
              <div className="flex flex-col">
                <label htmlFor="role">Role</label>
                <input
                  className="input w-full"
                  type="text"
                  name="role"
                  value={authenticatedManagement?.Role.name === 'staff' ? 'Staff': authenticatedManagement.Role.name === 'coordinator' ? 'Coordinator': authenticatedManagement.Role.name === 'assistant_coordinator' ? 'Assistant Coordinator' : 'Unauthorized'}
                  disabled
                />
              </div>
            </div>

            {
                ['staff', 'coordinator'].includes(authenticatedManagement.Role.name) ? 
                <>
                    <div className="subHeader3">
                        <h2 className="text-xl mt-7 font-semibold text-gray-700">
                            Signature
                        </h2>
                    </div>

                    <div className="mt-5">
                        <SignatureUpload
                            onFileSelect={handleSignatureSelect}
                            selectedFile={selectedSignature}
                            onRemoveFile={handleSignatureRemove}
                            preview={signaturePreview}
                            disabled={isSubmitting}
                            existingSignature={isEdit && currentInfo.signature_img ? currentInfo.signature_img : null}
                        />
                    </div>
                </>: null
            }

            <div className="action flex justify-end items-center my-4 space-x-2.5">
              <button
                onClick={() => setOpen(false)}
                className="btn text-gray-700 bg-gray-100 rounded-xl"
              >
                Close
              </button>
              <button
                disabled={isSubmitting || isUploadingSignature}
                type="submit"
                className="btn bg-blue-700 text-white rounded-xl"
              >
                { isSubmitting || isUploadingSignature ? 'Saving...' : 'Save Changes' }
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default EditManagementInformationModal;
