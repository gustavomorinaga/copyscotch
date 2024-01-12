import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { get, writable, type StartStopNotifier, type Writable } from 'svelte/store';
import { generateUUID } from '$lib/utils';
import type { TRESTRequestInfer } from '$lib/validators';

type TRESTTabStore = Writable<TRESTTabData> & TRESTTabActions;
type TRESTTabDataTemp = {
	editing?: TRESTRequestInfer['id'];
};
type TRESTTabDataPersist = {
	tabs: Array<TRESTRequestInfer>;
	current?: TRESTRequestInfer['id'];
};
type TRESTTabData = TRESTTabDataPersist & TRESTTabDataTemp;
type TRESTTabActions = {
	add: () => void;
	get: (id: TRESTRequestInfer['id']) => TRESTRequestInfer | undefined;
	update: (id: TRESTRequestInfer['id'], request: Partial<TRESTRequestInfer>) => void;
	setCurrent: (id: TRESTRequestInfer['id'] | undefined) => void;
	setEditing: (id: TRESTRequestInfer['id'] | undefined) => void;
	close: (id: TRESTRequestInfer['id']) => void;
	closeOthers: (id: TRESTRequestInfer['id']) => void;
	duplicate: (id: TRESTRequestInfer['id']) => void;
};

const CTX = 'REST_TAB_CTX';
const STORAGE_KEY = 'tabStateREST';
const INITIAL_DATA: TRESTTabData = { tabs: [], current: undefined, editing: undefined };
const DEFAULT_REQUEST: Omit<TRESTRequestInfer, 'id'> = {
	name: 'Untitled',
	url: 'https://jsonplaceholder.typicode.com/todos/1',
	method: 'GET'
};

export function setRESTTabStore(
	initialData: Partial<TRESTTabData> = INITIAL_DATA,
	start: StartStopNotifier<TRESTTabData> = () => {}
) {
	let channel: BroadcastChannel | null;

	const storedData = browser ? localStorage.getItem(STORAGE_KEY) : undefined;
	const data: TRESTTabData = storedData ? JSON.parse(storedData) : initialData;

	const store = writable(data, (set, update) => {
		channel = new BroadcastChannel(STORAGE_KEY);
		channel.addEventListener('message', (event) => {
			const data = event.data as TRESTTabData;
			update((state) => ({ ...state, ...data }));
		});

		const stopNotifier = start(set, update);

		return () => {
			channel?.close();
			if (stopNotifier) stopNotifier();
		};
	});

	function saveData(data: TRESTTabData) {
		if (!browser) return;

		const { tabs, current } = data;
		const persistData: TRESTTabDataPersist = { tabs, current };

		localStorage.setItem(STORAGE_KEY, JSON.stringify(persistData));
		channel?.postMessage(data);
	}

	const actions: TRESTTabActions = {
		add: () => {
			store.update((state) => {
				const newID = generateUUID();
				const tab = { ...DEFAULT_REQUEST, id: newID };
				state.tabs.push(tab);
				state.current = tab.id;
				saveData(state);
				return state;
			});
		},
		get: (id) => {
			const { tabs } = get(store);
			return tabs.find((tab) => tab.id === id);
		},
		update: (id, request) => {
			const { tabs } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			store.update((state) => {
				state.tabs[index] = { ...state.tabs[index], ...request };
				saveData(state);
				return state;
			});
		},
		duplicate: (id) => {
			const { tabs } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			store.update((state) => {
				const newID = generateUUID();
				const tab = { ...structuredClone(state.tabs[index]), id: newID };
				state.tabs.splice(index + 1, 0, tab);
				state.current = tab.id;
				saveData(state);
				return state;
			});
		},
		setCurrent: (id) => {
			const { tabs, current } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1 || current === id) return;

			store.update((state) => {
				state.current = id;
				saveData(state);
				return state;
			});
		},
		setEditing: (id) => {
			if (!id) {
				store.update((state) => {
					state.editing = undefined;
					saveData(state);
					return state;
				});
				return;
			}

			const { tabs } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			store.update((state) => {
				state.editing = id;
				saveData(state);
				return state;
			});
		},
		close: (id) => {
			const { tabs, current } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			const isCurrent = current === id;

			store.update((state) => {
				state.tabs.splice(index, 1);

				if (isCurrent) state.current = state.tabs.at(-1)?.id;

				saveData(state);
				return state;
			});
		},
		closeOthers: (id) => {
			const { tabs } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			store.update((state) => {
				state.tabs = [state.tabs[index]];
				state.current = id;
				saveData(state);
				return state;
			});
		}
	};

	setContext(CTX, { ...store, ...actions });
	return store;
}

export const getRESTTabStore = () => getContext<TRESTTabStore>(CTX);
