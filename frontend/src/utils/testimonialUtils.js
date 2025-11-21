import { Star } from 'lucide-react';

export const getBeneficiaryName = (beneficiary, fallback = 'Anonymous') => {
  if (!beneficiary) return fallback;
  const { firstname, lastname, middle_initial } = beneficiary;
  return `${firstname} ${middle_initial ? middle_initial + '. ' : ''}${lastname}`.trim();
};

export const getBeneficiaryInitials = (beneficiary, fallback = 'AN') => {
  if (!beneficiary) return fallback;
  const { firstname, lastname } = beneficiary;
  return `${firstname?.[0] || ''}${lastname?.[0] || ''}`.toUpperCase() || fallback;
};

export const renderStars = (rating, size = 16) => {
  return Array.from({ length: 5 }, (_, index) => (
    <Star
      key={index}
      size={size}
      className={index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
    />
  ));
};

