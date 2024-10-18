import { derived, writable } from 'svelte/store';
import type { Mode, ThemeColors } from './types';
import { withoutTransition } from './without-transition';
import type { TSettingsInfer } from '$lib/validators';
import { INITIAL_DATA as SETTINGS_INITIAL_DATA } from '$lib/contexts';

// saves having to branch for server vs client
const noopStorage = {
	getItem: (_key: string) => null,
	setItem: (_key: string, _value: string) => {}
};

// whether we are running on server vs client
const isBrowser = typeof document !== 'undefined';

// the modes that are supported, used for validation & type derivation
export const modes = ['black', 'dark', 'light', 'system'] as const;

/**
 * The key used to store the mode in localStorage.
 */
export const localStorageKey = 'settings';
/**
 * Writable store that represents the user's preferred mode (`"dark"`, `"light"` or `"system"`)
 */
export const userPrefersMode = createUserPrefersMode();
/**
 * Readable store that represents the system's preferred mode (`"dark"`, `"light"` or `undefined`)
 */
export const systemPrefersMode = createSystemMode();
/**
 * Theme colors for light and dark modes.
 */
export const themeColors = writable<ThemeColors>(undefined);
/**
 * Derived store that represents the current mode (`"black"`, `"dark"`, `"light"` or `undefined`)
 */
export const derivedMode = createDerivedMode();

// derived from: https://github.com/CaptainCodeman/svelte-web-storage
function createUserPrefersMode() {
	const defaultValue = 'system';

	const storage = isBrowser ? localStorage : noopStorage;
	const stored = JSON.parse(storage.getItem(localStorageKey) as string) as TSettingsInfer;
	const initialValue = stored?.backgroundColor;

	let value = isValidMode(initialValue) ? initialValue : defaultValue;

	const { subscribe, set: _set } = writable(value, () => {
		if (!isBrowser) return;
		const handler = (e: StorageEvent) => {
			if (e.key !== localStorageKey) return;
			const newValue = e.newValue;
			if (isValidMode(newValue)) {
				_set((value = newValue));
			} else {
				_set((value = defaultValue));
			}
		};
		addEventListener('storage', handler);
		return () => removeEventListener('storage', handler);
	});

	function set(v: Mode) {
		_set((value = v));
		storage.setItem(
			localStorageKey,
			JSON.stringify({ ...SETTINGS_INITIAL_DATA, ...stored, backgroundColor: v })
		);
	}

	return {
		subscribe,
		set
	};
}

function createSystemMode() {
	const defaultValue = undefined;
	let track = true;

	const { subscribe, set } = writable<'dark' | 'light' | 'black' | undefined>(defaultValue, () => {
		if (!isBrowser) return;

		const handler = (e: MediaQueryListEvent) => {
			if (!track) return;
			set(e.matches ? 'light' : 'dark');
		};

		const mediaQueryState = window.matchMedia('(prefers-color-scheme: light)');
		mediaQueryState.addEventListener('change', handler);
		return () => mediaQueryState.removeEventListener('change', handler);
	});

	/**
	 * Query system preferences and update the store.
	 */
	function query() {
		if (!isBrowser) return;
		const mediaQueryState = window.matchMedia('(prefers-color-scheme: light)');
		set(mediaQueryState.matches ? 'light' : 'dark');
	}

	/**
	 * Enable or disable tracking of system preference changes.
	 */
	function tracking(active: boolean) {
		track = active;
	}

	return {
		subscribe,
		query,
		tracking
	};
}

function createDerivedMode() {
	const { subscribe } = derived(
		[userPrefersMode, systemPrefersMode, themeColors],
		([$userPrefersMode, $systemPrefersMode, $themeColors]) => {
			if (!isBrowser) return undefined;

			const derivedMode = $userPrefersMode === 'system' ? $systemPrefersMode : $userPrefersMode;

			withoutTransition(() => {
				const htmlEl = document.documentElement;
				const themeColorEl = document.querySelector('meta[name="theme-color"]');
				if (derivedMode === 'light') {
					htmlEl.style.colorScheme = 'light';
					htmlEl.classList.remove('black', 'dark');
					if (themeColorEl && $themeColors) {
						themeColorEl.setAttribute('content', $themeColors.light);
					}
				} else if (derivedMode === 'dark') {
					htmlEl.style.colorScheme = 'dark';
					htmlEl.classList.remove('black');
					htmlEl.classList.add('dark');
					if (themeColorEl && $themeColors) {
						themeColorEl.setAttribute('content', $themeColors.dark);
					}
				} else if (derivedMode === 'black') {
					htmlEl.style.colorScheme = 'dark';
					htmlEl.classList.remove('dark');
					htmlEl.classList.add('black');
					if (themeColorEl && $themeColors) {
						themeColorEl.setAttribute('content', $themeColors.black);
					}
				}
			});

			return derivedMode;
		}
	);

	return {
		subscribe
	};
}

export function isValidMode(value: unknown): value is Mode {
	if (typeof value !== 'string') return false;
	return modes.includes(value as Mode);
}
