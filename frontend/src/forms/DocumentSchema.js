import { z } from 'zod';

export const uploadDocumentSchema = z.object({
    title: z.string().trim().min(1, { message: "Please give your upload a title" }),
    category: z.string().min(1, { message: "Please select a category" }),
    tags: z.string().optional().nullable(),
  });
