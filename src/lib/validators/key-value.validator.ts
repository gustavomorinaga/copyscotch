import { z } from 'zod';

export const KeyValueSchema = z.object({
	key: z.string().max(100),
	value: z.string().max(100),
	active: z.boolean().default(true)
});

export type TKeyValueSchema = typeof KeyValueSchema;
export type TKeyValueInfer = z.infer<TKeyValueSchema>;
export type TKeyValueMapped = Record<TKeyValueInfer['key'], TKeyValueInfer['value']>;

export const DEFAULT_KEY_VALUE: TKeyValueInfer = {
	key: '',
	value: '',
	active: true
};
