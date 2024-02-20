import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { writable, type StartStopNotifier, type Writable } from 'svelte/store';
import { setBackground, setTheme } from '$lib/utils';
import type { TSettingsInfer } from '$lib/validators';

type TSettingsContext = Writable<TSettingsData> & TSettingsActions;
type TSettingsData = TSettingsInfer;
type TSettingsActions = {
	save: (settings: Partial<TSettingsData>) => void;
};

const CTX = Symbol('SETTINGS_CTX');
const STORAGE_KEY = 'settings';
export const INITIAL_DATA: TSettingsData = {
	backgroundColor: 'system',
	accentColor: 'green',
	layout: 'vertical',
	navigation: 'collapse',
	sidebar: 'open',
	sidebarPosition: 'right',
	lineWrapping: false
};

export function setSettingsContext(
	initialData: Partial<TSettingsData> = INITIAL_DATA,
	start: StartStopNotifier<TSettingsData> = () => {}
): TSettingsContext {
	let channel: BroadcastChannel | null;

	const storedData = browser ? localStorage.getItem(STORAGE_KEY) : undefined;
	if (!storedData) localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
	const data: TSettingsData = storedData ? JSON.parse(storedData) : initialData;

	setTheme(data.accentColor);

	const store = writable(data, (set, update) => {
		function syncData(event: MessageEvent<TSettingsData>) {
			update((state) => ({ ...state, ...event.data }));
			channel?.close();
		}

		channel = new BroadcastChannel(STORAGE_KEY);
		channel.addEventListener('message', syncData);

		const stopNotifier = start(set, update);

		return () => {
			if (stopNotifier) stopNotifier();
		};
	});

	function saveData(data: TSettingsData) {
		if (!browser) return;

		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		channel?.postMessage(data);
	}

	const actions: TSettingsActions = {
		save: (settings) => {
			store.update((state) => {
				if (settings.backgroundColor && settings.backgroundColor !== state.backgroundColor) {
					setBackground(settings.backgroundColor);
				}

				if (settings.accentColor && settings.accentColor !== state.accentColor) {
					setTheme(settings.accentColor);
				}

				const newState = { ...state, ...settings };
				return newState;
			});
		}
	};

	store.subscribe((state) => saveData(state));

	const context = { ...store, ...actions } as TSettingsContext;
	return setContext(CTX, context);
}

export const getSettingsContext = () => getContext<TSettingsContext>(CTX);
