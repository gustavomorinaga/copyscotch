import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { get, writable, type StartStopNotifier, type Writable } from 'svelte/store';
import { RESTRepository } from '$lib/repositories';
import { generateUUID } from '$lib/utils';
import type { TFolderInfer, TFileInfer } from '$lib/validators';

type TRESTContext = Writable<TRESTData> & TRESTActions;
type TRESTData = Array<TFolderInfer>;
type TRESTActions = {
	getFolder: (id: TFolderInfer['id']) => TFolderInfer | undefined;
	getFile: (id: TFileInfer['id']) => TFileInfer | undefined;
	createFolder: (folder: TFolderInfer, parentID?: TFolderInfer['id']) => void;
	createFile: (file: TFileInfer, parentID: TFolderInfer['id']) => void;
	updateFolder: (folder: TFolderInfer) => void;
	updateFile: (file: TFileInfer) => void;
	removeFolder: (id: TFolderInfer['id']) => void;
	removeFile: (id: TFileInfer['id']) => void;
};

const CTX = Symbol('REST_COLLECTION_CTX');
const STORAGE_KEY = 'collectionsREST';
const INITIAL_DATA: TRESTData = [];
const DEFAULT_FOLDER: Omit<TFolderInfer, 'id'> = {
	name: 'Untitled',
	folders: [],
	requests: []
};
const DEFAULT_FILE: Omit<TFileInfer, 'id'> = {
	name: 'Untitled',
	url: 'https://jsonplaceholder.typicode.com/todos/1',
	method: 'GET'
};

export function setRESTContext(
	initialData: Partial<TRESTData> = INITIAL_DATA,
	start: StartStopNotifier<TRESTData> = () => {}
): TRESTContext {
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
		createFolder: (folder, parentID) => {
			const collections = get(store);
			const term: Partial<TFolderInfer> = parentID ? { id: parentID } : {};
			const newFolder: TFolderInfer = { ...DEFAULT_FOLDER, id: generateUUID(), name: folder.name };
			const newCollections = RESTRepository.createFolder(collections, term, newFolder);

			return store.update((state) => {
				state = newCollections;
				saveData(state);
				return state;
			});
		},
		createFile: (file, parentID) => {
			const collections = get(store);
			const newFile: TFileInfer = { ...DEFAULT_FILE, id: generateUUID(), name: file.name };
			const newCollections = RESTRepository.createFile(collections, { id: parentID }, newFile);

			return store.update((state) => {
				state = newCollections;
				saveData(state);
				return state;
			});
		},
		updateFolder(folder) {
			const collections = get(store);
			const newCollections = RESTRepository.updateFolder(collections, { id: folder.id }, folder);

			return store.update((state) => {
				state = newCollections;
				saveData(state);
				return state;
			});
		},
		updateFile(file) {
			const collections = get(store);
			const newCollections = RESTRepository.updateFile(collections, { id: file.id }, file);

			return store.update((state) => {
				state = newCollections;
				saveData(state);
				return state;
			});
		},
		removeFolder(id) {
			const collections = get(store);
			const newCollections = RESTRepository.removeFolder(collections, { id });

			return store.update((state) => {
				state = newCollections;
				saveData(state);
				return state;
			});
		},
		removeFile(id) {
			const collections = get(store);
			const newCollections = RESTRepository.removeFile(collections, { id });

			return store.update((state) => {
				state = newCollections;
				saveData(state);
				return state;
			});
		}
	};

	const context = { ...store, ...actions } as TRESTContext;
	return setContext(CTX, context);
}

export const getRESTContext = () => getContext<TRESTContext>(CTX);
