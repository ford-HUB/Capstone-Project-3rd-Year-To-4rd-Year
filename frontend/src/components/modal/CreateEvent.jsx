import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { eventSchema } from "../../forms/EventSchema.js";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useAuthStore } from "../../store/management/useAuthStore.js";
import { useProfileStore } from "../../store/management/useProfileStore.js";
import { useDepartment } from "../../context/useDepartmentContext.jsx";
import { useEventStore } from "../../store/event/useEventStore.js";

const CreateEvent = ({ onClose, onSave }) => {
    const { authenticatedManagement } = useAuthStore()
    const { managementCurrentProfile } = useProfileStore()
    const { departmentCourses } = useDepartment()
    const { addEvent } = useEventStore()
    const [previewUrl, setPreviewUrl] = useState(null);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(eventSchema),
        mode: 'onBlur',
        defaultValues: {
        title: '',
        description: '',
        event_started: '',
        event_ended: '',
        location: '',
        max_participants: '',
        organizer_name: '',
        category: authenticatedManagement?.Role?.name === 'coordinator' || authenticatedManagement?.Role?.name === 'assistant_coordinator' ? 'School' : '',
        specified_category: '',
        department: authenticatedManagement?.Role?.name === 'coordinator' || authenticatedManagement?.Role?.name === 'assistant_coordinator' ? managementCurrentProfile?.Department?.department_name : '',
        event_image: undefined,
        beneficiary_applicable: false,
        max_beneficiaries: undefined
        }
    });

    const category = watch('category');
    const beneficiaryApplicable = watch('beneficiary_applicable');

    // Clear max_beneficiaries when beneficiary_applicable is unchecked
    useEffect(() => {
        if (!beneficiaryApplicable) {
            setValue('max_beneficiaries', undefined, { shouldValidate: false });
        }
    }, [beneficiaryApplicable, setValue]);

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Clean up previous URL if exists
        if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        }

        // Create new preview URL
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setValue('event_image', file);
    };

    const removeImage = () => {
        if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setValue('event_image', undefined);
    };

    // Clean up object URL when component unmounts
    useEffect(() => {
        return () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        };
    }, [previewUrl]);

    const onSubmitForm = async(data) => {
        const formData = new FormData();
        
        // Append all fields
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('event_started', data.event_started);
        formData.append('event_ended', data.event_ended);
        formData.append('location', data.location);
        formData.append('max_participants', data.max_participants);
        formData.append('organizer_name', data.organizer_name);
        formData.append('category', data.category);
        
        if (data.category === 'School') {
            formData.append('department', data.department);
        }

        if(data.category === 'Others') {
            formData.append('specified_category', data.specified_category)
        }
        
        // Add beneficiary applicability fields - only include max_beneficiaries when beneficiary_applicable is true
        formData.append('beneficiary_applicable', data.beneficiary_applicable);
        if (data.beneficiary_applicable && data.max_beneficiaries && typeof data.max_beneficiaries === 'number' && data.max_beneficiaries > 0) {
            formData.append('max_beneficiaries', data.max_beneficiaries);
        }
        
        if (data.event_image) {
            formData.append('event_image', data.event_image);
        }

        // Debugging purposes
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        const success = await addEvent(formData);
        if (!success) return;

        onSave({
            ...data,
            id: Date.now(),
            participants: []
        });
        window.document.reload()
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl w-full max-w-2xl p-6 shadow-lg max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold">Create New Event</h2>
            <button 
                type="button"
                onClick={onClose} 
                className="text-gray-500 hover:text-gray-700"
            >
                <X size={20} />
            </button>
            </div>

            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6 overflow-y-auto flex-1 py-2 px-1">
            <div>
                <div className="flex items-center justify-center w-full">
                <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden">
                    {previewUrl ? (
                    <div className="relative w-full h-full">
                        <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                        />
                        <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            removeImage();
                        }}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                        >
                        <X size={16} className="text-gray-700" />
                        </button>
                    </div>
                    ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                    </div>
                    )}
                    <input 
                    id="dropzone-file" 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                    />
                </label>
                </div> 
            </div>
            
            {/* Event Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                <input
                type="text"
                placeholder="Enter event title"
                className={`w-full p-2 rounded-lg border ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('title')}
                />
                {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                )}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                placeholder="Enter event description"
                rows={4}
                className={`w-full p-2 rounded-lg border ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('description')}
                />
                {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Date & Time</label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                    <label className="block text-xs text-gray-500 mb-1">Start</label>
                    <input
                        type="datetime-local"
                        className={`w-full p-2 rounded-lg border ${
                            errors.event_started ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        {...register('event_started')}
                    />
                    {errors.event_started && (
                        <p className="mt-1 text-sm text-red-600">{errors.event_started.message}</p>
                    )}
                    </div>

                    <div className="relative">
                    <label className="block text-xs text-gray-500 mb-1">End</label>
                    <input
                        type="datetime-local"
                        className={`w-full p-2 rounded-lg border ${
                            errors.event_ended ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        {...register('event_ended')}
                    />
                    {errors.event_ended && (
                        <p className="mt-1 text-sm text-red-600">{errors.event_ended.message}</p>
                    )}
                    </div>
                </div>
                </div>
            </div>

            {/* Location & Participants */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                    type="text"
                    placeholder="Enter location"
                    className={`w-full p-2 rounded-lg border ${
                        errors.location ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register('location')}
                />
                {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Participants</label>
                <input
                    type="number"
                    placeholder="Enter max participants"
                    min="1"
                    className={`w-full p-2 rounded-lg border ${
                        errors.max_participants ? 'border-red-500' : 'border-gray-300'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    {...register('max_participants', { valueAsNumber: true })}
                />
                {errors.max_participants && (
                    <p className="mt-1 text-sm text-red-600">{errors.max_participants.message}</p>
                )}
                </div>
            </div>

            {/* Organizer Name */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Name</label>
                <input
                type="text"
                placeholder="Enter organizer name"
                className={`w-full p-2 rounded-lg border ${
                    errors.organizer_name ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('organizer_name')}
                />
                {errors.organizer_name && (
                <p className="mt-1 text-sm text-red-600">{errors.organizer_name.message}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select disabled={authenticatedManagement?.Role?.name === 'coordinator' || authenticatedManagement?.Role?.name === 'assistant_coordinator' || false}
                className={`w-full p-2 rounded-lg border ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                } ${authenticatedManagement?.Role?.name === 'coordinator' || authenticatedManagement?.Role?.name === 'assistant_coordinator'  && 'bg-gray-100 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('category')}
                >
                {
                    authenticatedManagement?.Role?.name === 'coordinator' || authenticatedManagement?.Role?.name === 'assistant_coordinator' ? 
                    <>
                        <option value="School">School</option>
                    </> :
                    <>
                        <option value="" disabled>Select category</option>
                        <option value="School">School</option>
                        <option value="Community">Community</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Donation Drive">Donation Drive</option>
                        <option value="Charity">Charity</option>
                        <option value="Health">Health</option>
                        <option value="Outreach">Outreach</option>
                        <option value="Training">Training</option>
                        <option value="Seminar">Seminar</option>
                        <option value="Others">Others</option>
                        </>
                }
                </select>
                {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                )}
            </div>

            {category === 'School' && (
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select disabled={authenticatedManagement?.Role?.name === 'coordinator' || authenticatedManagement?.Role?.name === 'assistant_coordinator' || false}
                className={`w-full p-2 rounded-lg border ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                } ${authenticatedManagement?.Role?.name === 'coordinator' || authenticatedManagement?.Role?.name === 'assistant_coordinator' && 'bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                {...register('department')}>

                {
                    authenticatedManagement?.Role?.name === 'coordinator' || authenticatedManagement?.Role?.name === 'assistant_coordinator' ? 
                    <option value={managementCurrentProfile?.Department?.department_name}>{managementCurrentProfile?.Department?.department_name}</option> :
                    <>
                        <option value="" disabled>Select department</option>
                        {Object.keys(departmentCourses).map((department) => (
                            <option key={department} value={department}>{department}</option>
                        ))}
                    </>
                }
                </select>
                {errors.department && (
                    <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                )}
                </div>
            )}

            {
                category === 'Others' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Specify Category</label>
                        <input 
                        {...register('specified_category')}
                        type="text"
                        className={`w-full p-2 rounded-lg border ${
                            errors.specified_category ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Please specify a category..."
                        />
                        {errors.specified_category && (
                            <p className="mt-1 text-sm text-red-600">{errors.specified_category.message}</p>
                        )}
                        </div>
                )
            }

            {/* Beneficiary Applicability Section */}
            <div className="border-t pt-4">
                <div className="flex items-center space-x-3 mb-4">
                    <input
                        type="checkbox"
                        id="beneficiary_applicable"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        {...register('beneficiary_applicable')}
                    />
                    <label htmlFor="beneficiary_applicable" className="text-sm font-medium text-gray-700">
                        Is this event applicable for beneficiaries?
                    </label>
                </div>
                
                {beneficiaryApplicable && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Maximum Beneficiaries
                        </label>
                        <input
                            type="number"
                            placeholder="Enter maximum number of beneficiaries"
                            min="1"
                            className={`w-full p-2 rounded-lg border ${
                                errors.max_beneficiaries ? 'border-red-500' : 'border-gray-300'
                            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            {...register('max_beneficiaries', { 
                                setValueAs: (value) => {
                                    if (value === '' || value === null || value === undefined) {
                                        return undefined;
                                    }
                                    const num = Number(value);
                                    return isNaN(num) ? undefined : num;
                                },
                                shouldUnregister: true
                            })}
                        />
                        {errors.max_beneficiaries && (
                            <p className="mt-1 text-sm text-red-600">{errors.max_beneficiaries.message}</p>
                        )}
                    </div>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                Cancel
                </button>
                <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                >
                {isSubmitting ? 'Creating...' : 'Create Event'}
                </button>
            </div>
            </form>
        </div>
    </div>
    );
};

export default CreateEvent;