import { getContext, setContext } from 'svelte';
import { type StartStopNotifier, type Writable, get, writable } from 'svelte/store';
import { browser } from '$app/environment';
import { generateUUID } from '$lib/utils';
import { DEFAULT_REQUEST, type TRESTTabInfer } from '$lib/validators';
import type { TResponse } from '$lib/ts';

export type TRESTTabContext = Writable<TRESTTabData> & TRESTTabActions;
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
	addTab: (request?: TRESTTabInfer['context']) => void;
	getTab: (id: TRESTTabInfer['context']['id']) => TRESTTabInfer | undefined;
	updateTab: (
		id: TRESTTabInfer['context']['id'],
		request: Partial<TRESTTabInfer['context']>
	) => void;
	duplicateTab: (id: TRESTTabInfer['context']['id']) => void;
	setCurrentTab: (id?: TRESTTabInfer['context']['id']) => void;
	setCurrentInnerTab: (
		id: TRESTTabInfer['context']['id'],
		tab: TRESTTabInfer['currentTab']
	) => void;
	setTaintedTabs: (ids?: Array<TRESTTabInfer['context']['id']>) => void;
	setDirtyTabs: (ids: Array<TRESTTabInfer['context']['id']>, dirty: TRESTTabInfer['dirty']) => void;
	setResult: (
		id: TRESTTabInfer['context']['id'],
		result?: Partial<Pick<TRESTResult, 'response' | 'sending'>>
	) => void;
	closeTabs: (props: {
		ids: Array<TRESTTabInfer['context']['id']>;
		mode: 'normal' | 'close-others' | 'close-all';
	}) => void;
};
export type TRESTResult = {
	id: TRESTTabInfer['context']['id'];
	response: TResponse;
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

export function setRESTTabContext(
	initialData: Partial<TRESTTabData> = INITIAL_DATA,
	start: StartStopNotifier<TRESTTabData> = () => {}
): TRESTTabContext {
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
		addTab: (request) => {
			let newTab: TRESTTabInfer;

			if (request) {
				const clonedRequest = structuredClone(request);
				newTab = {
					id: clonedRequest.id,
					context: clonedRequest,
					currentTab: 'params',
					dirty: false
				};
			} else {
				const newID = generateUUID();
				newTab = {
					id: newID,
					context: { ...DEFAULT_REQUEST, id: newID },
					currentTab: 'params',
					dirty: false
				};
			}

			return store.update((state) => {
				state.tabs.push(newTab);
				state.current = newTab.id;
				saveData(state);
				return state;
			});
		},
		getTab: (id) => {
			const { tabs } = get(store);
			return tabs.find((tab) => tab.id === id);
		},
		updateTab: (id, request) => {
			const { tabs } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			return store.update((state) => {
				Object.assign(state.tabs[index].context, request);
				saveData(state);
				return state;
			});
		},
		duplicateTab: (id) => {
			const { tabs } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			return store.update((state) => {
				const newID = generateUUID();
				const clonedTab = structuredClone(state.tabs[index]);
				const newTab: TRESTTabInfer = {
					...clonedTab,
					id: newID,
					context: { ...clonedTab.context, id: newID },
					currentTab: 'params',
					dirty: false
				};
				state.tabs.splice(index + 1, 0, newTab);
				state.current = newTab.id;
				saveData(state);
				return state;
			});
		},
		setCurrentTab: (id) => {
			const { tabs, current } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1 || current === id) return;

			return store.update((state) => {
				state.current = id;
				saveData(state);
				return state;
			});
		},
		setDirtyTabs: (ids, dirty) => {
			const { tabs } = get(store);
			for (const tab of tabs) if (ids.includes(tab.id)) tab.dirty = dirty;

			return store.update((state) => {
				state.tabs = tabs;
				saveData(state);
				return state;
			});
		},
		setCurrentInnerTab(id, tab) {
			const { tabs } = get(store);
			const index = tabs.findIndex((tab) => tab.id === id);
			if (index === -1) return;

			return store.update((state) => {
				state.tabs[index].currentTab = tab;
				saveData(state);
				return state;
			});
		},
		setTaintedTabs: (ids) => {
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
		closeTabs: ({ ids, mode } = { ids: [], mode: 'normal' }) => {
			const { current } = get(store);
			const hasCurrent = current ? ids.includes(current) : false;

			const closeActions: Record<typeof mode, () => void> = {
				normal: () => {
					return store.update((state) => {
						state.tabs = state.tabs.filter((tab) => !ids.includes(tab.id));
						state.results = state.results.filter((result) => !ids.includes(result.id));
						if (hasCurrent) state.current = state.tabs.at(-1)?.id;
						saveData(state);
						return state;
					});
				},
				'close-others': () => {
					return store.update((state) => {
						state.tabs = state.tabs.filter((tab) => ids.includes(tab.id));
						state.results = state.results.filter((result) => ids.includes(result.id));
						if (!hasCurrent) state.current = state.tabs.at(-1)?.id;
						saveData(state);
						return state;
					});
				},
				'close-all': () => {
					return store.update((state) => {
						state.tabs = [];
						state.results = [];
						state.current = undefined;
						saveData(state);
						return state;
					});
				}
			};

			return closeActions[mode]();
		}
	};

	const context = { ...store, ...actions } as TRESTTabContext;
	return setContext(CTX, context);
}

export const getRESTTabContext = () => getContext<TRESTTabContext>(CTX);
