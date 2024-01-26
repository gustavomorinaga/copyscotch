import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { get, writable, type StartStopNotifier, type Writable } from 'svelte/store';
import { findNested, updateNested } from '$lib/utils';
import type { TRESTCollectionInfer, TRESTRequestInfer } from '$lib/validators';

type TRESTStore = Writable<TRESTData> & TRESTActions;
type TRESTData = Array<TRESTCollectionInfer>;
type TRESTActions = {
	getCollection: (id: TRESTCollectionInfer['id']) => TRESTCollectionInfer | undefined;
	getRequest: (id: TRESTRequestInfer['id']) => TRESTRequestInfer | undefined;
	saveCollection: (collection: TRESTCollectionInfer) => void;
	saveRequests: (requests: Array<TRESTRequestInfer>) => void;
};

const CTX = Symbol('REST_COLLECTION_CTX');
const STORAGE_KEY = 'collectionsREST';
const INITIAL_DATA: TRESTData = [];

export function setRESTStore(
	initialData: Partial<TRESTData> = INITIAL_DATA,
	start: StartStopNotifier<TRESTData> = () => {}
): TRESTStore {
	let channel: BroadcastChannel | null;

	const storedData = browser ? localStorage.getItem(STORAGE_KEY) : undefined;
	if (!storedData) localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
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
		getCollection: (id) => {
			const collections = get(store);
			return collections.find((collection) => collection.id === id);
		},
		getRequest: (id) => {
			const collections = get(store);
			return findNested(collections, { id });
		},
		saveCollection: (collection) => {
			return store.update((state) => {
				const index = state.findIndex(({ id }) => id === collection.id);
				index !== -1 ? (state[index] = collection) : state.push(collection);
				saveData(state);
				return state;
			});
		},
		saveRequests: (requests) => {
			// find existent requests and update them
			// if not existent, add them

			const collections = get(store);

			for (const request of requests) {
				const updated = updateNested(collections, { id: request.id }, { requests: [request] });
				console.log(updated);
			}
		}
	};

	const context = { ...store, ...actions } as TRESTStore;
	return setContext(CTX, context);
}

export const getRESTStore = () => getContext<TRESTStore>(CTX);
