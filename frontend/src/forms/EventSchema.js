import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string({
    required_error: 'Title is required',
    invalid_type_error: 'Title must be a string',
  }).min(1, 'Title cannot be empty'),

  description: z.string({
    required_error: 'Description is required',
    invalid_type_error: 'Description must be a string',
  }).min(1, 'Description cannot be empty'),

  event_started: z.coerce.date({
    required_error: 'Start date and time is required',
    invalid_type_error: 'event_started must be a valid date',
  }),

  event_ended: z.coerce.date({
    required_error: 'End date and time is required',
    invalid_type_error: 'event_ended must be a valid date',
  }),

  location: z.string({
    required_error: 'Location is required',
    invalid_type_error: 'Location must be a string',
  }).min(1, 'Location cannot be empty'),

  max_participants: z.coerce.number({
    required_error: 'Max participants is required',
    invalid_type_error: 'Max participants must be a number',
  }).int().min(1, 'There must be at least 1 participant allowed'),

  organizer_name: z.string({
    required_error: 'Organizer is required',
    invalid_type_error: 'Organizer must be a string',
  }),

  category: z.enum([
    'School', 'Community', 'Emergency', 'Donation Drive',
    'Charity', 'Relief Program', 'Health', 'Outreach'
  ], {
    required_error: 'Category is required',
    invalid_type_error: 'Category must be one of the predefined options',
  }),

  department: z.string().optional(),

  event_image: z.instanceof(File, {
    message: 'Event image is required',
  })
  .refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB max size
    {
      message: 'Image must be less than 5MB',
    }
  )
  .refine(
    (file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
    {
      message: 'Only JPEG, PNG, GIF, and WEBP formats are allowed',
    }
  ),
})
.refine((data) => data.event_ended > data.event_started, {
  message: 'event_ended must be after event_started',
  path: ['event_ended'],
})
.refine((data) => data.category !== 'School' || data.department?.trim(), {
  message: 'Department is required for school events',
  path: ['department'],
});


