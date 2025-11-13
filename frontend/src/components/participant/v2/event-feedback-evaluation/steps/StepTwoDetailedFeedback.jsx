import StepHeader from "../ui/StepHeader";
import TextAreaField from "../fields/TextAreaField";

const StepTwoDetailedFeedback = ({ register, errors }) => (
  <div className="space-y-6">
    <StepHeader 
      title="Tell us more"
      description="Share your detailed thoughts and experiences"
    />
    
    <div className="space-y-6">
      <TextAreaField
        label="What was most rewarding about volunteering for this event?(Optional)"
        error={errors.mostValuable?.message}
        placeholder="Share what you found most rewarding..."
        {...register("mostValuable")}
      />
      
      <TextAreaField
        label="What challenges did you face or what could be improved?(Optional)"
        error={errors.leastValuable?.message}
        placeholder="Share any challenges or areas for improvement..."
        {...register("leastValuable")}
      />
      
      <TextAreaField
        label="Suggestions for Future Volunteer Programs(Optional)"
        error={errors.suggestions?.message}
        placeholder="Training ideas, role improvements, recognition suggestions..."
        {...register("suggestions")}
      />
    </div>
  </div>
);

export default StepTwoDetailedFeedback;
