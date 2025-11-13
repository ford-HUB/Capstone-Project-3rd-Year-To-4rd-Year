import React from 'react';
import { Users, CheckCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

const StepTwoTargetRole = ({ watchedValues, setValue, errors, formLinkStatus }) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-4">Who is this form for?</h3>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select the target audience for this form. This determines who will be able to access and fill out the form.
        </p>
      </div>
      
      <div className="max-w-md mx-auto">
        <div className="space-y-4">
          {/* Volunteer Option */}
          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              watchedValues.target_role === 'volunteer' 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : formLinkStatus?.volunteer?.hasForm
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setValue('target_role', 'volunteer')}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                watchedValues.target_role === 'volunteer' 
                  ? 'bg-blue-500 text-white' 
                  : formLinkStatus?.volunteer?.hasForm
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
              }`}>
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">Volunteer</h4>
                <p className="text-sm text-gray-600">
                  {formLinkStatus?.volunteer?.hasForm 
                    ? `Form assigned: ${formLinkStatus.volunteer.formTitle}`
                    : 'For volunteers participating in the event'
                  }
                </p>
              </div>
              {watchedValues.target_role === 'volunteer' && (
                <CheckCircle className="w-6 h-6 text-blue-500" />
              )}
              {!watchedValues.target_role && formLinkStatus?.volunteer?.hasForm && (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              )}
            </div>
          </div>

          {/* Beneficiary Option */}
          <div 
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
              watchedValues.target_role === 'beneficiary' 
                ? 'border-blue-500 bg-blue-50 shadow-lg' 
                : formLinkStatus?.beneficiary?.hasForm
                  ? 'border-green-500 bg-green-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setValue('target_role', 'beneficiary')}
          >
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                watchedValues.target_role === 'beneficiary' 
                  ? 'bg-blue-500 text-white' 
                  : formLinkStatus?.beneficiary?.hasForm
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-600'
              }`}>
                <Users className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-gray-900">Beneficiary</h4>
                <p className="text-sm text-gray-600">
                  {formLinkStatus?.beneficiary?.hasForm 
                    ? `Form assigned: ${formLinkStatus.beneficiary.formTitle}`
                    : 'For beneficiaries receiving services from the event'
                  }
                </p>
              </div>
              {watchedValues.target_role === 'beneficiary' && (
                <CheckCircle className="w-6 h-6 text-blue-500" />
              )}
              {!watchedValues.target_role && formLinkStatus?.beneficiary?.hasForm && (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              )}
            </div>
          </div>
        </div>

        {errors.target_role && (
          <div className="flex items-center space-x-2 mt-4 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.target_role.message}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StepTwoTargetRole;
