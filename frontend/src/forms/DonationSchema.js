import { z } from 'zod';

// Base donation schema
export const donationSchema = z.object({
  // Amount validation
  amount: z.string().optional(),
  customAmount: z.string().optional(),
  
  // Payment method
  paymentMethod: z.enum(['card', 'gcash', 'paymaya', 'bank'], {
    required_error: 'Please select a payment method'
  }),
  
  // Card payment fields
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardName: z.string().optional(),
  
  // Mobile wallet fields
  gcashNumber: z.string().optional(),
  paymayaNumber: z.string().optional(),
  
  // Bank transfer fields
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
  
  // Preferences
  isAnonymous: z.boolean().default(false),
  showReceipt: z.boolean().default(true),
  newsletter: z.boolean().default(false)
}).refine((data) => {
  // Amount validation - either preset amount or custom amount must be provided
  return data.amount || data.customAmount;
}, {
  message: 'Please select or enter an amount',
  path: ['amount']
}).refine((data) => {
  // Payment method specific validations
  if (data.paymentMethod === 'card') {
    return data.cardNumber && data.expiryDate && data.cvv && data.cardName;
  }
  return true;
}, {
  message: 'Card payment details are required',
  path: ['cardNumber']
}).refine((data) => {
  if (data.paymentMethod === 'gcash') {
    return data.gcashNumber;
  }
  return true;
}, {
  message: 'GCash number is required',
  path: ['gcashNumber']
}).refine((data) => {
  if (data.paymentMethod === 'paymaya') {
    return data.paymayaNumber;
  }
  return true;
}, {
  message: 'PayMaya number is required',
  path: ['paymayaNumber']
}).refine((data) => {
  if (data.paymentMethod === 'bank') {
    return data.bankAccount && data.bankName;
  }
  return true;
}, {
  message: 'Bank details are required',
  path: ['bankAccount']
});

// Step-specific schemas for progressive validation
export const amountStepSchema = z.object({
  amount: z.string().optional(),
  customAmount: z.string().optional()
}).refine((data) => {
  return data.amount || data.customAmount;
}, {
  message: 'Please select or enter an amount',
  path: ['amount']
});

export const paymentStepSchema = z.object({
  paymentMethod: z.enum(['card', 'gcash', 'paymaya', 'bank'], {
    required_error: 'Please select a payment method'
  }),
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardName: z.string().optional(),
  gcashNumber: z.string().optional(),
  paymayaNumber: z.string().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional()
}).refine((data) => {
  if (data.paymentMethod === 'card') {
    return data.cardNumber && data.expiryDate && data.cvv && data.cardName;
  }
  return true;
}, {
  message: 'Card payment details are required',
  path: ['cardNumber']
}).refine((data) => {
  if (data.paymentMethod === 'gcash') {
    return data.gcashNumber;
  }
  return true;
}, {
  message: 'GCash number is required',
  path: ['gcashNumber']
}).refine((data) => {
  if (data.paymentMethod === 'paymaya') {
    return data.paymayaNumber;
  }
  return true;
}, {
  message: 'PayMaya number is required',
  path: ['paymayaNumber']
}).refine((data) => {
  if (data.paymentMethod === 'bank') {
    return data.bankAccount && data.bankName;
  }
  return true;
}, {
  message: 'Bank details are required',
  path: ['bankAccount']
});

export const preferencesStepSchema = z.object({
  isAnonymous: z.boolean().default(false),
  showReceipt: z.boolean().default(true),
  newsletter: z.boolean().default(false)
});
