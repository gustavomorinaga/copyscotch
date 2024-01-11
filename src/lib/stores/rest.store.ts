import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { get, writable, type StartStopNotifier, type Writable } from 'svelte/store';
import type { TRESTRequestInfer } from '$lib/validators';

type TRESTData = { requests: Array<TRESTRequestInfer> };
type TRESTActions = {
	add: (request: TRESTRequestInfer) => void;
	get: (id: TRESTRequestInfer['id']) => TRESTRequestInfer | undefined;
	update: (id: TRESTRequestInfer['id'], request: Partial<TRESTRequestInfer>) => void;
};
type TRESTStore = Writable<TRESTData> & TRESTActions;

const CTX = 'REST_COLLECTION_CTX';
const STORAGE_KEY = 'collectionsREST';
const INITIAL_DATA: TRESTData = { requests: [] };

export function setRESTStore(
	initialData: Partial<TRESTData> = INITIAL_DATA,
	start: StartStopNotifier<TRESTData> = () => {}
) {
	let channel: BroadcastChannel | null;

	const storedData = browser ? JSON.parse(String(localStorage.getItem(STORAGE_KEY))) : undefined;
	const data: TRESTData = storedData ?? initialData;

	const store = writable(data, (set, update) => {
		channel = new BroadcastChannel(STORAGE_KEY);
		channel.addEventListener('message', ({ data }) => {
			const dataPersist = data as TRESTData;
			update((state) => ({ ...state, ...dataPersist }));
		});

		const stopNotifier = start(set, update);

		return () => {
			channel?.close();
			if (stopNotifier) stopNotifier();
		};
	});

	function saveData(data: TRESTData) {
		if (!browser) return;

		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		channel?.postMessage(data);
	}

	const actions: TRESTActions = {
		add: (request) => {
			store.update((state) => {
				state.requests.push(request);
				saveData(state);
				return state;
			});
		},
		get: (id) => {
			const { requests } = get(store);
			return requests.find((request) => request.id === id);
		},
		update: (id, request) => {
			store.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				state.requests[index] = { ...state.requests[index], ...request };
				saveData(state);
				return state;
			});
		}
	};

	setContext(CTX, { ...store, ...actions });
	return store;
}

export const getRESTStore = () => getContext<TRESTStore>(CTX);
