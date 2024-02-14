import {
	localStorageKey,
	userPrefersMode,
	systemPrefersMode,
	derivedMode,
	themeColors
} from './stores';
import type { Mode, ThemeColors } from './types';
import type { TSettingsInfer } from '$lib/validators';

/** Set the mode to light or dark */
export function setMode(mode: Mode): void {
	userPrefersMode.set(mode);
}

/** Reset the mode to operating system preference */
export function resetMode(): void {
	userPrefersMode.set('system');
}

export function setInitialMode(defaultMode: Mode, themeColors?: ThemeColors) {
	const rootEl = document.documentElement;
	const stored = JSON.parse(localStorage.getItem('settings') as string) as TSettingsInfer;
	const mode = stored.backgroundColor || defaultMode;
	const light =
		mode === 'light' ||
		(mode === 'system' && window.matchMedia('(prefers-color-scheme: light)').matches);
	const dark =
		mode === 'dark' ||
		(mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
	const black = mode === 'black';

	if (light) {
		rootEl.style.colorScheme = 'light';
		rootEl.classList.remove('black', 'dark');
	} else if (dark) {
		rootEl.style.colorScheme = 'dark';
		rootEl.classList.remove('black');
		rootEl.classList.add('dark');
	} else if (black) {
		rootEl.style.colorScheme = 'black';
		rootEl.classList.remove('dark');
		rootEl.classList.add('black');
	}

	if (themeColors) {
		const themeMetaEl = document.querySelector('meta[name="theme-color"]');
		if (themeMetaEl) {
			themeMetaEl.setAttribute(
				'content',
				mode === 'light'
					? themeColors.light
					: mode === 'dark'
						? themeColors.dark
						: themeColors.black
			);
		}
	}

	const settings: TSettingsInfer = { ...stored, backgroundColor: mode };
	localStorage.setItem('settings', JSON.stringify(settings));
}

export { localStorageKey, userPrefersMode, systemPrefersMode, derivedMode as mode, themeColors };
