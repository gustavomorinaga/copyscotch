import { z } from 'zod';

export const SettingsSchema = z.object({
	sidebar: z.enum(['open', 'closed'])
});

export type TSettingsSchema = typeof SettingsSchema;
export type TSettingsInfer = z.infer<TSettingsSchema>;
