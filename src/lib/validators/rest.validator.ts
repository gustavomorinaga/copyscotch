import { z } from 'zod';

export const editRequestSchema = z.object({
	name: z.string().min(1).max(100)
});

export type TEditRequestSchema = typeof editRequestSchema;
