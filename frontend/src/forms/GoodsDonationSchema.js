import { z } from 'zod';

// Base goods donation schema
export const goodsDonationSchema = z.object({
  // Goods information
  goodsType: z.enum(['ready_to_eat_food', 'hygiene_kits', 'baby_needs', 'bottled_water', 'blankets_towels', 'emergency_kits', 'medicine'], {
    required_error: 'Please select a goods type'
  }),
  goodsDescription: z.string().min(10, 'Please provide a detailed description (at least 10 characters)'),
  quantity: z.union([z.string(), z.number()]).refine((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return !isNaN(num) && num > 0;
  }, { message: 'Quantity must be a valid positive number' }),
  quantityUnit: z.enum(['Items', 'Boxes', 'Pieces'], {
    required_error: 'Please select a quantity unit'
  }),
  condition: z.enum(['new', 'like_new', 'good', 'fair']).optional(),
  
  // Contact information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  
  // Drop-off information
  dropoffLocation: z.string().min(1, 'Please select a drop-off location'),
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.string().min(1, 'Please select a preferred time'),
  
  // Preferences
  isAnonymous: z.boolean().default(false),
  showReceipt: z.boolean().default(true)
}).refine((data) => {
  // Only require condition for non-food, non-emergency, non-medicine, non-bottled-water types
  const noConditionTypes = ['ready_to_eat_food', 'emergency_kits', 'medicine', 'bottled_water'];
  if (!noConditionTypes.includes(data.goodsType)) {
    return data.condition !== undefined && data.condition !== '';
  }
  return true;
}, {
  message: 'Please select the condition',
  path: ['condition']
});

// Step-specific schemas for progressive validation
export const goodsStepSchema = z.object({
  goodsType: z.enum(['ready_to_eat_food', 'hygiene_kits', 'baby_needs', 'bottled_water', 'blankets_towels', 'emergency_kits', 'medicine'], {
    required_error: 'Please select a goods type'
  }),
  goodsDescription: z.string().min(10, 'Please provide a detailed description (at least 10 characters)'),
  quantity: z.union([z.string(), z.number()]).refine((val) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    return !isNaN(num) && num > 0;
  }, { message: 'Quantity must be a valid positive number' }),
  quantityUnit: z.enum(['Items', 'Boxes', 'Pieces'], {
    required_error: 'Please select a quantity unit'
  }),
  condition: z.enum(['new', 'like_new', 'good', 'fair']).optional()
}).refine((data) => {
  // Only require condition for non-food, non-emergency, non-medicine, non-bottled-water types
  const noConditionTypes = ['ready_to_eat_food', 'emergency_kits', 'medicine', 'bottled_water'];
  if (!noConditionTypes.includes(data.goodsType)) {
    return data.condition !== undefined && data.condition !== '';
  }
  return true;
}, {
  message: 'Please select the condition',
  path: ['condition']
});

export const contactStepSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required')
});

export const dropoffStepSchema = z.object({
  dropoffLocation: z.string().min(1, 'Please select a drop-off location'),
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.string().min(1, 'Please select a preferred time')
});

export const confirmationStepSchema = z.object({
  isAnonymous: z.boolean().default(false),
  showReceipt: z.boolean().default(true)
});
