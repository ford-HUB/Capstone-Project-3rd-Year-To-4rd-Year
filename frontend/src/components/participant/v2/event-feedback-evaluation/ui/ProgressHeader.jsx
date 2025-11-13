
const ProgressHeader = ({ currentStep, totalSteps, steps, title = "Volunteer Feedback", description = "Share your experience to help us improve" }) => (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">{title}</h1>
        <p className="text-blue-100 mb-4">{description}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-100">Step {currentStep} of {totalSteps}</span>
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-8 h-2 rounded-full transition-all duration-300 ${
                  i + 1 <= currentStep ? 'bg-white' : 'bg-blue-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
  
      <div className="px-6 py-4 border-b bg-gray-50 border-gray-300">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium text-blue-600">{steps[currentStep - 1].title}</span>
          <span className="mx-2">•</span>
          <span>{steps[currentStep - 1].description}</span>
        </div>
      </div>
    </>
);

export default ProgressHeader