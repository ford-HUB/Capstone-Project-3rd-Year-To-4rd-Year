import StepHeader from "../ui/StepHeader";
import StarRating from "../ui/StarRating";
import { Controller } from "react-hook-form";

const StepOneExperienceRating = ({ control, errors }) => {
  const ratingFields = [
    { key: 'overallRating', label: 'Overall Volunteer Experience *', error: errors.overallRating },
    { key: 'contentQuality', label: 'Training & Preparation Quality', error: errors.contentQuality },
    { key: 'organizationRating', label: 'Volunteer Coordination', error: errors.organizationRating },
    { key: 'venueRating', label: 'Support & Resources', error: errors.venueRating }
  ];

  return (
    <div className="space-y-8">
      <StepHeader 
        title="How was your volunteer experience?"
        description="Rate different aspects of your volunteering experience"
      />
      
      <div className="space-y-8">
        {ratingFields.map(({ key, label, error }) => (
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

export default StepOneExperienceRating;
