import { InputField } from "../InputField";
import { CategorySelector } from "../CategorySelector";
import { AdvancedOptions } from "../AdvanceOptions";

const StepTwo = ({ register, watcher, errors, showAdvanced, onToggleAdvanced }) => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Tell us about your files</h2>
        <p className="text-gray-600">This helps organize and find your documents later</p>
      </div>
  
      <div className="bg-gray-50 rounded-lg p-6 space-y-6">
        <InputField
          id="title"
          name="title"
          {...register('title')}
          label="What should we call this upload?"
          error={errors.title?.message}
          placeholder="e.g., Monthly Reports, Project Proposal, Contract Documents"
          required
        />
  
        <CategorySelector
          {...register('category')}
          selectedValue={watcher('category')}
          error={errors.category?.message}
        />
  
        <AdvancedOptions
          showAdvanced={showAdvanced}
          onToggle={onToggleAdvanced}
          {...register('tags')}
        />
      </div>
    </div>
);

export default StepTwo