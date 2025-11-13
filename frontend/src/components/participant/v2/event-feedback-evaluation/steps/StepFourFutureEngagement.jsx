import StepHeader from "../ui/StepHeader";
import RadioGroup from "../fields/RadioGroup";
import InputField from "../fields/InputField";
import { Controller } from "react-hook-form";

const StepFourFutureEngagement = ({ control, register, errors }) => {
  const recommendOptions = ['Definitely', 'Probably', 'Maybe', 'Probably Not', 'Definitely Not'];
  const participationOptions = ['Yes, definitely', 'Yes, probably', 'Maybe', 'Probably not', 'No'];

  return (
    <div className="space-y-6">
      <StepHeader 
        title="Future Engagement"
        description="Help us understand your future volunteer interests"
      />
      
      <div className="space-y-6">
        <Controller
          name="recommendEvent"
          control={control}
          render={({ field }) =>  (
            <RadioGroup
              label="Would you recommend volunteering for our events to others?"
              options={recommendOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.recommendEvent?.message}
              required
            />
          )}
        />

        <InputField
          label="What volunteer roles or activities would you be interested in for future events?(Optional)"
          placeholder="E.g., community outreach, donation drives, tutoring, clean-ups..."
          {...register("futureTopics")}
        />
        
        <Controller
          name="futureParticipation"
          control={control}
          render={({ field }) => (
            <RadioGroup
              label="Would you be interested in volunteering for future events?"
              options={participationOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.futureParticipation?.message}
            />
          )}
        />
      </div>
    </div>
  );
};

export default StepFourFutureEngagement;
