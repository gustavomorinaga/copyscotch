import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { get, writable, type StartStopNotifier, type Writable } from 'svelte/store';
import { findNested } from '$lib/utils';
import type { TRESTCollectionInfer, TRESTRequestInfer } from '$lib/validators';

type TRESTStore = Writable<TRESTData> & TRESTActions;
type TRESTData = Array<TRESTCollectionInfer>;
type TRESTActions = {
	getRequest: (id: TRESTRequestInfer['id']) => TRESTRequestInfer | undefined;
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

	// function saveData(data: TRESTData) {
	// 	if (!browser) return;

	// 	localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
	// 	channel?.postMessage(data);
	// }

	const actions: TRESTActions = {
		getRequest: (id) => {
			const collections = get(store);
			return findNested<TRESTRequestInfer>(collections, { requests: { id } });
		},
		saveRequests: (requests) => {
			console.log(requests);
			return;

			// return store.update((state) => {
			// 	state = [...state, { id: generateUUID(), name: 'New Collection', requests, folders: [] }];
			// 	saveData(state);
			// 	return state;
			// });

			// const { requests: savedRequests } = get(store);

			// const newRequests = requests.filter(
			// 	(request) => !savedRequests.find(({ id }) => id === request.id)
			// );
			// const updatedRequests = requests.filter((request) =>
			// 	savedRequests.find(({ id }) => id === request.id)
			// );

			// return store.update((state) => {
			// 	if (newRequests.length) state.requests.push(...newRequests);
			// 	if (updatedRequests.length)
			// 		for (const request of updatedRequests) {
			// 			const index = state.requests.findIndex(({ id }) => id === request.id);
			// 			state.requests[index] = request;
			// 		}

			// 	saveData(state);
			// 	return state;
			// });
		}
	};

	const context = { ...store, ...actions } as TRESTStore;
	return setContext(CTX, context);
}

export const getRESTStore = () => getContext<TRESTStore>(CTX);
