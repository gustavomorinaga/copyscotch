import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { get, writable, type StartStopNotifier, type Writable } from 'svelte/store';
import { generateUUID } from '$lib/utils';
import type { TRESTTabInfer } from '$lib/validators';

export type TRESTTabDataTemp = {
	editing?: TRESTTabInfer['context']['id'];
	tainted?: TRESTTabInfer['context']['id'];
};
export type TRESTTabDataPersist = {
	tabs: Array<TRESTTabInfer>;
	current?: TRESTTabInfer['context']['id'];
};
export type TRESTTabData = TRESTTabDataPersist & TRESTTabDataTemp;
export type TRESTTabStore = Writable<TRESTTabData> & TRESTTabActions;
export type TRESTTabActions = {
	add: () => void;
	get: (id: TRESTTabInfer['context']['id']) => TRESTTabInfer | undefined;
	update: (id: TRESTTabInfer['context']['id'], request: Partial<TRESTTabInfer['context']>) => void;
	setCurrent: (id: TRESTTabInfer['context']['id'] | undefined) => void;
	setEditing: (id: TRESTTabInfer['context']['id'] | undefined) => void;
	setDirty: (id: TRESTTabInfer['context']['id'], dirty: TRESTTabInfer['dirty']) => void;
	setTainted: (id: TRESTTabInfer['context']['id'] | undefined) => void;
	close: (id: TRESTTabInfer['context']['id']) => void;
	closeOthers: (id: TRESTTabInfer['context']['id']) => void;
	duplicate: (id: TRESTTabInfer['context']['id']) => void;
};

const CTX = 'REST_TAB_CTX';
const STORAGE_KEY = 'tabStateREST';
const INITIAL_DATA: TRESTTabData = { tabs: [], current: undefined, editing: undefined };
const DEFAULT_REQUEST: Omit<TRESTTabInfer['context'], 'id'> = {
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
		function syncData(event: MessageEvent<TRESTTabData>) {
			const { tabs, current } = event.data;
			const dataPersist: TRESTTabDataPersist = { tabs, current };
			update((state) => ({ ...state, ...dataPersist }));
		}

		channel = new BroadcastChannel(STORAGE_KEY);
		channel.addEventListener('message', syncData);

		const stopNotifier = start(set, update);

		return () => {
			channel?.close();
			if (stopNotifier) stopNotifier();
		};
	});

	function saveData(data: TRESTTabData) {
		if (!browser) return;

		const { tabs, current } = data;
		const dataPersist: TRESTTabDataPersist = { tabs, current };

		localStorage.setItem(STORAGE_KEY, JSON.stringify(dataPersist));
		channel?.postMessage(data);
	}

	const actions: TRESTTabActions = {
		add: () => {
			return store.update((state) => {
				const newTabID = generateUUID();
				const newRequestID = generateUUID();
				const newTab: TRESTTabInfer = {
					id: newTabID,
					context: { ...DEFAULT_REQUEST, id: newRequestID },
					dirty: false
				};
				state.tabs.push(newTab);
				state.current = newTab.id;
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

			return store.update((state) => {
				Object.assign(state.tabs[index].context, request);
				saveData(state);
				return state;
			});
		},
		duplicate: (id) => {
			const { tabs } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			return store.update((state) => {
				const newTabID = generateUUID();
				const newRequestID = generateUUID();
				const clonedTab = structuredClone(state.tabs[index]);
				const newTab = {
					...clonedTab,
					id: newTabID,
					context: { ...clonedTab.context, id: newRequestID },
					dirty: false,
				};
				state.tabs.splice(index + 1, 0, newTab);
				state.current = newTab.id;
				saveData(state);
				return state;
			});
		},
		setCurrent: (id) => {
			const { tabs, current } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1 || current === id) return;

			return store.update((state) => {
				state.current = id;
				saveData(state);
				return state;
			});
		},
		setEditing: (id) => {
			if (!id) {
				return store.update((state) => {
					state.editing = undefined;
					saveData(state);
					return state;
				});
			}

			const { tabs } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			return store.update((state) => {
				state.editing = id;
				saveData(state);
				return state;
			});
		},
		setDirty: (id, dirty) => {
			const { tabs } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			return store.update((state) => {
				state.tabs[index].dirty = dirty;
				saveData(state);
				return state;
			});
		},
		setTainted: (id) => {
			if (!id) {
				return store.update((state) => {
					state.tainted = undefined;
					saveData(state);
					return state;
				});
			}

			const { tabs } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			return store.update((state) => {
				state.tainted = id;
				saveData(state);
				return state;
			});
		},
		close: (id) => {
			const { tabs, current } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			const isCurrent = current === id;

			return store.update((state) => {
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

			return store.update((state) => {
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
