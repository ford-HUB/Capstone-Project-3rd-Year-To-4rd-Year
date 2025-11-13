import { StepIndicator } from "./StepIndicator";

export const ProgressBar = ({ currentStep }) => (
    <div className="mb-8">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <StepIndicator 
          step={1} 
          title="Choose Files" 
          completed={currentStep > 1} 
          active={currentStep === 1} 
        />
        <div className={`flex-1 h-1 mx-4 ${currentStep > 1 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        <StepIndicator 
          step={2} 
          title="Add Details" 
          completed={currentStep > 2} 
          active={currentStep === 2} 
        />
        <div className={`flex-1 h-1 mx-4 ${currentStep > 2 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
        <StepIndicator 
          step={3} 
          title="Review & Upload" 
          completed={false} 
          active={currentStep === 3} 
        />
      </div>
    </div>
);