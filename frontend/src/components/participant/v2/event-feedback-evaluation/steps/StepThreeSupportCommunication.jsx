import StepHeader from "../ui/StepHeader";
import StarRating from "../ui/StarRating";
import { Controller } from "react-hook-form";

const StepThreeSupportCommunication = ({ control, errors }) => {
  const supportRatings = [
    { key: 'guidanceDuringEvent', label: 'Guidance & Support During Event*', error: errors.guidanceDuringEvent },
    { key: 'communicationRating', label: 'Communication from Organizers*', error: errors.communicationRating }
  ];

  return (
    <div className="space-y-8">
      <StepHeader 
        title="Support & Communication"
        description="How well were you supported throughout the process?"
      />
      
      <div className="space-y-8">
        {supportRatings.map(({ key, label, error }) => (
          <Controller
            key={key}
            name={key}
            control={control}
            render={({ field }) => (
              <StarRating
                rating={field.value}
                onRatingChange={field.onChange}
                label={label}
                error={error?.message}
              />
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default StepThreeSupportCommunication;
