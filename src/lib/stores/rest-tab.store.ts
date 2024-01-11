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

	const storedData = browser ? JSON.parse(String(localStorage.getItem(STORAGE_KEY))) : undefined;
	const data: TRESTTabData = storedData ?? initialData;

	const store = writable(data, (set, update) => {
		channel = new BroadcastChannel(STORAGE_KEY);
		channel.addEventListener('message', ({ data }) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { editing, ...dataPersist } = data as TRESTTabData;
			update((state) => ({ ...state, ...dataPersist }));
		});

		const stopNotifier = start(set, update);

		return () => {
			channel?.close();
			if (stopNotifier) stopNotifier();
		};
	});

	function saveData(data: TRESTTabData) {
		if (!browser) return;

		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		channel?.postMessage(data);
	}

	const actions: TRESTTabActions = {
		add: () => {
			store.update((state) => {
				const id = generateUUID();
				state.tabs.push({ ...DEFAULT_REQUEST, id });
				state.current = id;
				saveData(state);
				return state;
			});
		},
		get: (id) => {
			const { tabs } = get(store);
			return tabs.find((tab) => tab.id === id);
		},
		update: (id, request) => {
			store.update((state) => {
				const index = state.tabs.findIndex((tab) => tab.id === id);
				if (index === -1) return state;

				state.tabs[index] = { ...state.tabs[index], ...request };
				saveData(state);
				return state;
			});
		},
		duplicate: (id) => {
			store.update((state) => {
				const index = state.tabs.findIndex((tab) => tab.id === id);
				if (index === -1) return state;

				const tab = state.tabs[index];
				const duplicatedTab = { ...structuredClone(tab), id: generateUUID() };
				state.tabs.splice(index + 1, 0, duplicatedTab);
				state.current = duplicatedTab.id;
				saveData(state);
				return state;
			});
		},
		setCurrent: (id) => {
			store.update((state) => {
				const index = state.tabs.findIndex((tab) => tab.id === id);
				if (index === -1) return state;

				state.current = id;
				saveData(state);
				return state;
			});
		},
		setEditing: (id) => {
			store.update((state) => {
				const index = state.tabs.findIndex((tab) => tab.id === id);
				if (index === -1) return state;

				state.editing = id;
				saveData(state);
				return state;
			});
		},
		close: (id) => {
			store.update((state) => {
				const index = state.tabs.findIndex((tab) => tab.id === id);
				if (index === -1) return state;

				const isCurrent = state.current === id;
				if (isCurrent) state.current = state.tabs.length ? state.tabs[index - 1]?.id : undefined;

				state.tabs = state.tabs.filter((request) => request.id !== id);
				state.current = index === 0 ? state.tabs[0]?.id : state.tabs[index - 1]?.id;

				saveData(state);
				return state;
			});
		},
		closeOthers: (id) => {
			store.update((state) => {
				const index = state.tabs.findIndex((tab) => tab.id === id);
				if (index === -1) return state;

				state.tabs = state.tabs.filter((tab) => tab.id === id);
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
