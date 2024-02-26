import { z } from 'zod';

export const KeyValueSchema = z.object({
	key: z.string().min(1).max(100),
	value: z.string().min(1).max(100),
	active: z.boolean().default(true)
});

export type TKeyValueSchema = typeof KeyValueSchema;
export type TKeyValueInfer = z.infer<TKeyValueSchema>;
