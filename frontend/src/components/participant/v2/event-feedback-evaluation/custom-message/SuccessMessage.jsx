import { CheckCircle } from "lucide-react";

const SuccessMessage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
        <p className="text-gray-600 mb-6">
          Your volunteer feedback has been submitted successfully. We appreciate your time and insights.
        </p>
        <div className="bg-green-50 p-4 rounded-lg">
          <p className="text-sm text-green-800">
            Your feedback helps us improve our volunteer program and create better experiences.
          </p>
        </div>
      </div>
    </div>
);

export default SuccessMessage