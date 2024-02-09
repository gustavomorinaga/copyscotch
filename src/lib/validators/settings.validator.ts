import { z } from 'zod';

export const SettingsSchema = z.object({
	layout: z.enum(['horizontal', 'vertical']),
	navigation: z.enum(['collapse', 'expand']),
	sidebar: z.enum(['open', 'closed']),
	lineWrapping: z.boolean()
});

export type TSettingsSchema = typeof SettingsSchema;
export type TSettingsInfer = z.infer<TSettingsSchema>;
