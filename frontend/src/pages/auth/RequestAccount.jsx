import React from 'react'
import { X } from 'lucide-react'
import { asset } from '../../assets/asset.jsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { requestApprovalSchema } from '../../forms/managementSchema.js'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/management/useAuthStore.js'
import toast from 'react-hot-toast'

const RequestAccount = () => {
  const { requestApproval } = useAuthStore()
  const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(requestApprovalSchema),
    defaultValues: {
      email: '',
      fullname: '',
      requested_role: '',
      reason: ''
    }
  })

  const onSubmitForm = async (formData) => {
    const success = await requestApproval(formData)
    if(!success) return
    reset({
      email: '',
      fullname: '',
      requested_role: '',
      reason: ''
    })
  }

  React.useEffect(() => {
    errors.email && toast.error(errors.email.message)
    errors.fullname && toast.error(errors.fullname.message)
    errors.requested_role && toast.error(errors.requested_role.message)
    errors.reason && toast.error(errors.reason.message)
  }, [errors])

  return (
    <>
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-3">
              <img
                src={asset.logo}
                alt="logo"
                className="h-12 w-12 object-contain"
              />
              <img
                src={asset.uclmLogo}
                alt="UCLM logo"
                className="h-12 w-12 object-contain"
              />
            </div>
            <a href='/' className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </a>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              Request Management Access
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To request access, please fill out the form below. Your request will be reviewed by an administrator, and you'll receive an email once approved.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmitForm)}>
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                {...register('email')}
                placeholder="john.doe@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none"
                {...register('fullname')}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Requested Role *
              </label>
              <select
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none bg-white"
                {...register('requested_role')}
              >
                <option value="" disabled>Select a role</option>
                <option value="staff">Staff</option>
                <option value="coordinator">Coordinator</option>
                <option value="assistant_coordinator">Assistant Coordinator</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Reason for Request *
              </label>
              <textarea
                required
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none resize-vertical"
                {...register('reason')}
                placeholder="Please explain why you need access and how you plan to use it (e.g., 'I want to manage events and coordinate student activities.')"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:bg-blue-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting Request...</span>
                  </div>
                ) : (
                  'Submit Request for Approval'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default RequestAccount