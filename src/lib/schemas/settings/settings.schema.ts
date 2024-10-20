import { z } from 'zod';

export const BackgroundColorEnum = z.enum(['system', 'light', 'dark', 'black']);

export const AccentColorEnum = z.enum([
	'green',
	'teal',
	'blue',
	'indigo',
	'purple',
	'yellow',
	'orange',
	'red',
	'pink'
]);
export const LayoutEnum = z.enum(['horizontal', 'vertical']);

export const NavigationEnum = z.enum(['collapse', 'expand']);

export const SidebarEnum = z.enum(['open', 'closed']);

export const SidebarPositionEnum = z.enum(['left', 'right']);

export const SettingsSchema = z.object({
	backgroundColor: BackgroundColorEnum,
	accentColor: AccentColorEnum,
	layout: LayoutEnum,
	navigation: NavigationEnum,
	sidebar: SidebarEnum,
	sidebarPosition: SidebarPositionEnum,
	lineWrapping: z.boolean()
});

export type TSettingsSchema = typeof SettingsSchema;
export type TSettingsInfer = z.infer<TSettingsSchema>;

export const ThemeSchema = SettingsSchema.pick({ backgroundColor: true, accentColor: true }).extend(
	{ expandNavigation: z.boolean(), sidebarOnLeft: z.boolean() }
);

export type TThemeSchema = typeof ThemeSchema;
export type TThemeInfer = z.infer<TThemeSchema>;

export const DEFAULT_SETTINGS: TSettingsInfer = {
	backgroundColor: 'system',
	accentColor: 'orange',
	layout: 'vertical',
	navigation: 'collapse',
	sidebar: 'open',
	sidebarPosition: 'right',
	lineWrapping: false
};
