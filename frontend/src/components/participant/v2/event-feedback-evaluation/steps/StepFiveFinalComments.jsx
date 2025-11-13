import StepHeader from "../ui/StepHeader";
import TextAreaField from "../fields/TextAreaField";
import CheckboxField from "../fields/CheckBoxField";
import { Controller } from "react-hook-form";

const StepFiveFinalComments = ({ control, register }) => (
  <div className="space-y-6">
    <StepHeader 
      title="Final Thoughts"
      description="Any additional comments and permissions"
    />
    
    <div className="space-y-3">
      <TextAreaField
        label="Any other feedback or comments?"
        placeholder="Share any additional thoughts..."
        {...register("additionalComments")}
      />
      
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Permissions</h3>
        <div className="space-y-3">
          <Controller
            name="shareTestimonial"
            control={control}
            render={({ field }) => (
              <CheckboxField
                label="I consent to my feedback being used as a testimonial (anonymous)"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
    </div>
  </div>
);

export default StepFiveFinalComments;
