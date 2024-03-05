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
	backgroundColor: BackgroundColorEnum.default('system'),
	accentColor: AccentColorEnum.default('green'),
	layout: LayoutEnum.default('vertical'),
	navigation: NavigationEnum.default('expand'),
	sidebar: SidebarEnum.default('closed'),
	sidebarPosition: SidebarPositionEnum.default('right'),
	lineWrapping: z.boolean()
});

export const ThemeSchema = SettingsSchema.pick({ backgroundColor: true, accentColor: true }).extend(
	{ expandNavigation: z.boolean(), sidebarOnLeft: z.boolean() }
);

export type TSettingsSchema = typeof SettingsSchema;
export type TSettingsInfer = z.infer<TSettingsSchema>;
export type TThemeSchema = typeof ThemeSchema;
export type TThemeInfer = z.infer<TThemeSchema>;

export const DEFAULT_SETTINGS: TSettingsInfer = {
	backgroundColor: 'system',
	accentColor: 'green',
	layout: 'vertical',
	navigation: 'collapse',
	sidebar: 'open',
	sidebarPosition: 'right',
	lineWrapping: false
};
