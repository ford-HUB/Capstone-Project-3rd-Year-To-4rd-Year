import { Star, AlertCircle } from "lucide-react";

const StarRating = ({ rating, onRatingChange, label, error }) => {
    const getRatingText = (rating) => {
      const ratingTexts = {
        0: 'Click to rate',
        1: 'Poor',
        2: 'Fair',
        3: 'Good',
        4: 'Very Good',
        5: 'Excellent'
      };
      return ratingTexts[rating] || '';
    };
  
    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onRatingChange(star)}
              className={`p-2 transition-all duration-200 transform hover:scale-110 ${
                star <= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
              }`}
            >
              <Star className="w-10 h-10 fill-current drop-shadow-sm" />
            </button>
          ))}
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600 font-medium">{getRatingText(rating)}</p>
        </div>
        {error && (
          <p className="text-sm text-red-600 flex items-center justify-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {error}
          </p>
        )}
      </div>
    );
};

export default StarRating