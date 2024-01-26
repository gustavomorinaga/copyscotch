import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { get, writable, type StartStopNotifier, type Writable } from 'svelte/store';
import { generateUUID } from '$lib/utils';
import type { TRESTTabInfer } from '$lib/validators';

export type TRESTTabStore = Writable<TRESTTabData> & TRESTTabActions;
export type TRESTTabData = TRESTTabDataPersist & TRESTTabDataTemp;
export type TRESTTabDataTemp = {
	tainted: Array<TRESTTabInfer['context']['id']>;
	results: Array<TRESTResult>;
};
export type TRESTTabDataPersist = {
	tabs: Array<TRESTTabInfer>;
	current?: TRESTTabInfer['context']['id'];
};
export type TRESTTabActions = {
	add: (request?: TRESTTabInfer['context']) => void;
	get: (id: TRESTTabInfer['context']['id']) => TRESTTabInfer | undefined;
	update: (id: TRESTTabInfer['context']['id'], request: Partial<TRESTTabInfer['context']>) => void;
	duplicate: (id: TRESTTabInfer['context']['id']) => void;
	setCurrent: (id?: TRESTTabInfer['context']['id']) => void;
	setTainted: (ids?: Array<TRESTTabInfer['context']['id']>) => void;
	setDirty: (ids: Array<TRESTTabInfer['context']['id']>, dirty: TRESTTabInfer['dirty']) => void;
	setResult: (
		id: TRESTTabInfer['context']['id'],
		result?: Partial<Pick<TRESTResult, 'response' | 'sending'>>
	) => void;
	close: (props: {
		ids: Array<TRESTTabInfer['context']['id']>;
		mode: 'normal' | 'close-others' | 'close-all';
	}) => void;
};
export type TRESTResult = Pick<TRESTTabInfer['context'], 'id'> & {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	response: Pick<Response, 'ok' | 'status' | 'headers'> & { time: number; json: any; blob: Blob };
	sending: boolean;
};

const CTX = Symbol('REST_TAB_CTX');
const STORAGE_KEY = 'tabStateREST';
const INITIAL_DATA: TRESTTabData = {
	tabs: [],
	current: undefined,
	tainted: [],
	results: []
};
const DEFAULT_REQUEST: Omit<TRESTTabInfer['context'], 'id'> = {
	name: 'Untitled',
	url: 'https://jsonplaceholder.typicode.com/todos/1',
	method: 'GET'
};

export function setRESTTabStore(
	initialData: Partial<TRESTTabData> = INITIAL_DATA,
	start: StartStopNotifier<TRESTTabData> = () => {}
): TRESTTabStore {
	let channel: BroadcastChannel | null;

	const storedData = browser ? localStorage.getItem(STORAGE_KEY) : undefined;
	if (!storedData) localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
	const data: TRESTTabData = storedData
		? { ...initialData, ...JSON.parse(storedData) }
		: initialData;

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
		const stringifiedData = JSON.stringify(dataPersist);
		const parsedData = JSON.parse(stringifiedData);

		localStorage.setItem(STORAGE_KEY, stringifiedData);
		channel?.postMessage(parsedData);
	}

	const actions: TRESTTabActions = {
		add: (request) => {
			let newTab: TRESTTabInfer;

			if (request) {
				newTab = { id: request.id, context: request, dirty: false };
			} else {
				const newTabID = generateUUID();
				newTab = { id: newTabID, context: { ...DEFAULT_REQUEST, id: newTabID }, dirty: false };
			}

			return store.update((state) => {
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
					dirty: false
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
		setDirty: (ids, dirty) => {
			const { tabs } = get(store);
			for (const tab of tabs) if (ids.includes(tab.id)) tab.dirty = dirty;

			return store.update((state) => {
				state.tabs = tabs;
				saveData(state);
				return state;
			});
		},
		setTainted: (ids) => {
			if (!ids) {
				return store.update((state) => {
					state.tainted = [];
					saveData(state);
					return state;
				});
			}

			const { tabs } = get(store);
			const tainted = ids.filter((id) => tabs.some((tab) => tab.id === id));

			return store.update((state) => {
				state.tainted = tainted;
				saveData(state);
				return state;
			});
		},
		setResult: (id, result = { response: undefined, sending: false }) => {
			const { results } = get(store);
			const index = results.findIndex((result) => result.id === id);

			if (index === -1) {
				return store.update((state) => {
					state.results.push({ id, ...result } as TRESTResult);
					saveData(state);
					return state;
				});
			} else if (!result) {
				return store.update((state) => {
					results.splice(index, 1);
					saveData(state);
					return state;
				});
			}

			return store.update((state) => {
				state.results[index] = { ...state.results[index], ...result };
				saveData(state);
				return state;
			});
		},
		close: ({ ids, mode } = { ids: [], mode: 'normal' }) => {
			const { current } = get(store);
			const hasCurrent = current ? ids.includes(current) : false;

			const closeActions: Record<typeof mode, () => void> = {
				normal: () => {
					return store.update((state) => {
						state.tabs = state.tabs.filter((tab) => !ids.includes(tab.id));
						if (hasCurrent) state.current = state.tabs.at(-1)?.id;
						saveData(state);
						return state;
					});
				},
				'close-others': () => {
					return store.update((state) => {
						state.tabs = state.tabs.filter((tab) => ids.includes(tab.id));
						if (!hasCurrent) state.current = state.tabs.at(-1)?.id;
						saveData(state);
						return state;
					});
				},
				'close-all': () => {
					return store.update((state) => {
						state.tabs = [];
						state.current = undefined;
						saveData(state);
						return state;
					});
				}
			};

			return closeActions[mode]();
		}
	};

	const context = { ...store, ...actions } as TRESTTabStore;
	return setContext(CTX, context);
}

export const getRESTTabStore = () => getContext<TRESTTabStore>(CTX);
