import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { writable, type StartStopNotifier, type Writable } from 'svelte/store';
import type { TSettingsInfer } from '$lib/validators';

type TSettingsStore = Writable<TSettingsData> & TSettingsActions;
type TSettingsData = TSettingsInfer;
type TSettingsActions = {
	save: (settings: TSettingsData) => void;
};

const CTX = Symbol('SETTINGS_CTX');
const STORAGE_KEY = 'settings';
const INITIAL_DATA: TSettingsData = { sidebar: 'open' };

export function setSettingsStore(
	initialData: Partial<TSettingsData> = INITIAL_DATA,
	start: StartStopNotifier<TSettingsData> = () => {}
): TSettingsStore {
	let channel: BroadcastChannel | null;

	const storedData = browser ? localStorage.getItem(STORAGE_KEY) : undefined;
	if (!storedData) localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
	const data: TSettingsData = storedData ? JSON.parse(storedData) : initialData;

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
				const newState = { ...state, ...settings };
				return newState;
			});
		}
	};

	store.subscribe((state) => saveData(state));

	const context = { ...store, ...actions } as TSettingsStore;
	return setContext(CTX, context);
}

export const getSettingsStore = () => getContext<TSettingsStore>(CTX);
