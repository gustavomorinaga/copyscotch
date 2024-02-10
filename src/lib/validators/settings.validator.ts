import { z } from 'zod';

export const SettingsSchema = z.object({
	backgroundColor: z.enum(['system', 'light', 'dark', 'black']),
	accentColor: z.enum([
		'green',
		'teal',
		'blue',
		'indigo',
		'purple',
		'yellow',
		'orange',
		'red',
		'pink'
	]),
	layout: z.enum(['horizontal', 'vertical']),
	navigation: z.enum(['collapse', 'expand']),
	sidebar: z.enum(['open', 'closed']),
	lineWrapping: z.boolean()
});

export const ThemeSchema = SettingsSchema.pick({ backgroundColor: true, accentColor: true }).extend(
	{ expandNavigation: z.boolean(), sidebarOnLeft: z.boolean() }
);

export type TSettingsSchema = typeof SettingsSchema;
export type TSettingsInfer = z.infer<TSettingsSchema>;
export type TThemeSchema = typeof ThemeSchema;
export type TThemeInfer = z.infer<TThemeSchema>;
