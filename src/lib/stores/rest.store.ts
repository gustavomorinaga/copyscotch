import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { get, writable, type StartStopNotifier, type Writable } from 'svelte/store';
import type { TRESTRequestInfer } from '$lib/validators';

type TRESTData = { requests: Array<TRESTRequestInfer> };
type TRESTActions = {
	get: (id: TRESTRequestInfer['id']) => TRESTRequestInfer | undefined;
	save: (request: TRESTRequestInfer) => void;
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

	const storedData = browser ? localStorage.getItem(STORAGE_KEY) : undefined;
	const data: TRESTData = storedData ? JSON.parse(storedData) : initialData;

	const store = writable(data, (set, update) => {
		function syncData(event: MessageEvent<TRESTData>) {
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

	function saveData(data: TRESTData) {
		if (!browser) return;

		localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
		channel?.postMessage(data);
	}

	const actions: TRESTActions = {
		get: (id) => {
			const { requests } = get(store);
			return requests.find((request) => request.id === id);
		},
		save: (request) => {
			const { requests } = get(store);
			const index = requests.findIndex(({ id }) => request.id === id);
			const isNew = index === -1;

			return store.update((state) => {
				if (isNew) state.requests.push(request);
				else state.requests[index] = request;
				saveData(state);
				return state;
			});
		}
	};

	setContext(CTX, { ...store, ...actions });
	return store;
}

export const getRESTStore = () => getContext<TRESTStore>(CTX);
