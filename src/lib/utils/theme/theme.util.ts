import { browser } from '$app/environment';
import { AccentColorEnum, type TThemeInfer } from '$lib/schemas/settings';
import { setMode } from '$lib/components/mode-watcher';

/**
 * Set the theme accent color
 * @param theme - The theme accent color
 */
export function setTheme(theme: TThemeInfer['accentColor']) {
	if (!browser) return;

	const { options: accentOptions } = AccentColorEnum;
	const rootEl = document.documentElement;

	rootEl.dataset.accent = accentOptions.includes(theme) ? theme : 'green';
}

/**
 * Set the theme background color
 * @param background - The theme background color
 */
export function setBackground(background: TThemeInfer['backgroundColor']) {
	return setMode(background);
}
