import { getContext, setContext } from 'svelte';
// import { browser } from '$app/environment';
import { setBackground, setTheme } from '$lib/utils/theme';
import { DEFAULT_SETTINGS, type TSettingsInfer } from '$lib/schemas/settings';

const CTX = Symbol('SETTINGS');
// export const STORAGE_KEY = 'settings';
export const INITIAL_DATA = DEFAULT_SETTINGS;

/**
 * Settings state
 * @returns The settings state
 */
export class SettingsState {
	accentColor = $state<TSettingsInfer['accentColor']>(DEFAULT_SETTINGS.accentColor);
	backgroundColor = $state<TSettingsInfer['backgroundColor']>(DEFAULT_SETTINGS.backgroundColor);
	layout = $state<TSettingsInfer['layout']>(DEFAULT_SETTINGS.layout);
	navigation = $state<TSettingsInfer['navigation']>(DEFAULT_SETTINGS.navigation);
	sidebar = $state<TSettingsInfer['sidebar']>(DEFAULT_SETTINGS.sidebar);
	sidebarPosition = $state<TSettingsInfer['sidebarPosition']>(DEFAULT_SETTINGS.sidebarPosition);
	lineWrapping = $state<TSettingsInfer['lineWrapping']>(DEFAULT_SETTINGS.lineWrapping);

	save(settings: Partial<TSettingsInfer>) {
		Object.assign(this, settings);

		if (settings.backgroundColor && settings.backgroundColor !== this.backgroundColor) {
			setBackground(settings.backgroundColor);
		}

		if (settings.accentColor && settings.accentColor !== this.accentColor) {
			setTheme(settings.accentColor);
		}
	}
}

/**
 * Set the settings context
 * @returns The settings context
 */
export function setSettingsContext() {
	return setContext(CTX, new SettingsState());
}

/**
 * Get the settings context
 * @returns The settings context
 */
export function getSettingsContext() {
	return getContext<ReturnType<typeof setSettingsContext>>(CTX);
}
