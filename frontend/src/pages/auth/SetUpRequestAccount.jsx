import React from 'react'
import { X } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { asset } from '../../assets/asset.jsx'
import { zodResolver } from '@hookform/resolvers/zod'
import { setUpRequestSchema } from '../../forms/managementSchema.js'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../../store/management/useAuthStore.js'
import toast from 'react-hot-toast'
import { useDepartment } from '../../context/useDepartmentContext'

const SetUpRequestAccount = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')
  const { departmentCourses } = useDepartment()
  const { registerAccount, acceptedRole } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(setUpRequestSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      department: ''
    }
  })

  const onSubmitForm = async (formData) => {
    const success = await registerAccount(formData, token)
    if (!success) return
    navigate('/')
  }

  React.useEffect(() => {
    if (errors.email) toast.error(errors.email.message)
    if (errors.password) toast.error(errors.password.message)
    if (errors.confirmPassword) toast.error(errors.confirmPassword.message)
    if (errors.role) toast.error(errors.role.message)
    if (errors.department) toast.error(errors.department.message)
  }, [errors])

  console.log(acceptedRole)

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

        <form className="space-y-6" onSubmit={handleSubmit(onSubmitForm)}>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                {...register('password')}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password {acceptedRole}
              </label>
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="Confirm password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

            {(acceptedRole === 'coordinator' || acceptedRole === 'assistant_coordinator') && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Department
              </label>
              <select
                {...register('department')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="" className="text-gray-400">Select Department</option>
                {Object.keys(departmentCourses).map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
          >
            {isSubmitting ? 'Confirming...' : 'Confirm'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SetUpRequestAccount