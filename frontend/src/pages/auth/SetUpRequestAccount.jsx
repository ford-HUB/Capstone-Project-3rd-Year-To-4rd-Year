import React from 'react'
import { X } from 'lucide-react'
import { asset } from '../../assets/asset.jsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { requestApprovalSchema } from '../../forms/StaffSchema.js'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/staff/useAuthStore.js'
import toast from 'react-hot-toast'
import { useDepartment } from '../../context/useDepartmentContext'

const SetUpRequestAccount = () => {
  const { departmentCourses } = useDepartment()
  const { requestApproval } = useAuthStore()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(requestApprovalSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      department: ''
    }
  })

  const selectedRole = watch('role')

  const onSubmitForm = async (data) => {
    const success = await requestApproval(data)
    if (!success) return
  }

  React.useEffect(() => {
    if (errors.email) toast.error(errors.email.message)
    if (errors.password) toast.error(errors.password.message)
    if (errors.confirmPassword) toast.error(errors.confirmPassword.message)
    if (errors.role) toast.error(errors.role.message)
    if (errors.department) toast.error(errors.department.message)
  }, [errors])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="bg-white shadow-md rounded-lg w-full max-w-2xl p-8">
        <div className="logo flex justify-between">
          <div className="flex gap-2">
            <img src={asset.logo} alt="logo" className="h-12 w-12" />
            <img src={asset.uclmLogo} alt="logo" className="h-12 w-12" />
          </div>
          <a href="/"><X /></a>
        </div>

        <div className="header flex justify-center items-center pb-6 pt-2">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            Set Up Your Access Account
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmitForm)}>
          <div className='grid grid-cols-2 gap-2.5'>
            <div className='flex flex-col'>
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              className="input w-full border mt-1 px-3 py-2 rounded-md"
            />
            </div>

            <div className='flex flex-col'>
                <label className="text-sm font-medium text-gray-700">Role</label>
                <select
                {...register('role')}
                className="input border w-full mt-1 px-3 py-2 rounded-md"
                >
                <option value="">Select Role</option>
                <option value="staff">Staff</option>
                <option value="coordinator">Coordinator</option>
                </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className='flex flex-col'>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                {...register('password')}
                className="input w-full border rounded-md"
              />
            </div>
            <div className='flex flex-col'>
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className="input w-full border rounded-md"
              />
            </div>
          </div>

          {selectedRole === 'coordinator' && (
            <div className='flex flex-col'>
              <label className="text-sm font-medium text-gray-700">Department</label>
              <select
                {...register('department')}
                className="input border w-full mt-1 px-3 py-2 rounded-md"
              >
                <option value="">Select Department</option>
                {Object.keys(departmentCourses).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            {isSubmitting ? 'Comfirming...' : 'Comfirm'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SetUpRequestAccount
