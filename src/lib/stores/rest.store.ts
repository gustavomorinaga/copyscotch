import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { get, writable, type StartStopNotifier, type Writable } from 'svelte/store';
import { RESTRepository } from '$lib/repositories';
import type { TFolderInfer, TFileInfer } from '$lib/validators';

type TRESTStore = Writable<TRESTData> & TRESTActions;
type TRESTData = Array<TFolderInfer>;
type TRESTActions = {
	getFolder: (id: TFolderInfer['id']) => TFolderInfer | undefined;
	getFile: (id: TFileInfer['id']) => TFileInfer | undefined;
	createFolder: (parentID: TFolderInfer['id'], folder: TFolderInfer) => void;
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
		getFolder: (id) => {
			const collections = get(store);
			return RESTRepository.findFolder(collections, { id });
		},
		getFile: (id) => {
			const collections = get(store);
			return RESTRepository.findFile(collections, { id });
		},
		createFolder: (parentID, folder) => {
			const collections = get(store);
			const newCollections = RESTRepository.createFolder(collections, { id: parentID }, folder);
			saveData(newCollections);
		}
	};

	const context = { ...store, ...actions } as TRESTStore;
	return setContext(CTX, context);
}

export const getRESTStore = () => getContext<TRESTStore>(CTX);
