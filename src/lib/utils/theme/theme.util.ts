import { browser } from '$app/environment';
import { AccentColorEnum, type TThemeInfer } from '$lib/schemas/settings';
import { setMode } from '$lib/components/mode-watcher';

export function setTheme(theme: TThemeInfer['accentColor']) {
	if (!browser) return;

	const { options: accentOptions } = AccentColorEnum;
	const rootEl = document.documentElement;

	rootEl.dataset.accent = accentOptions.includes(theme) ? theme : 'green';
}

export function setBackground(background: TThemeInfer['backgroundColor']) {
	return setMode(background);
}
