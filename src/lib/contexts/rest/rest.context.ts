import { getContext, setContext } from 'svelte';
import { type StartStopNotifier, type Writable, get, writable } from 'svelte/store';
import { browser } from '$app/environment';
import { RESTRepository } from '$lib/repositories/rest';
import { generateUUID } from '$lib/utils/uuid';
import {
	DEFAULT_FILE,
	DEFAULT_FOLDER,
	type TFileInfer,
	type TFolderInfer
} from '$lib/schemas/collection';

type TRESTContext = Writable<TRESTData> & TRESTActions;
type TRESTData = Array<TFolderInfer>;
type TRESTActions = {
	/**
	 * Get a folder by ID
	 * @param id - The ID of the folder to get
	 * @returns The folder object if found
	 */
	getFolder: (id: TFolderInfer['id']) => TFolderInfer | undefined;
	/**
	 * Get a file by ID
	 * @param id - The ID of the file to get
	 * @returns The file object if found
	 */
	getFile: (id: TFileInfer['id']) => TFileInfer | undefined;
	/**
	 * Create a new folder
	 * @param folder - The folder object to create
	 * @param parentID - The ID of the parent folder
	 */
	createFolder: (folder: TFolderInfer, parentID?: TFolderInfer['id']) => void;
	/**
	 * Create a new file
	 * @param file - The file object to create
	 * @param parentID - The ID of the parent folder
	 */
	createFile: (file: TFileInfer, parentID: TFolderInfer['id']) => void;
	/**
	 * Update a folder by ID
	 * @param folder - The folder object to update
	 */
	updateFolder: (folder: TFolderInfer) => void;
	/**
	 * Update a file by ID
	 * @param file - The file object to update
	 */
	updateFile: (file: TFileInfer) => void;
	/**
	 * Remove a folder by ID
	 * @param id - The ID of the folder to remove
	 */
	removeFolder: (id: TFolderInfer['id']) => void;
	/**
	 * Remove a file by ID
	 * @param id - The ID of the file to remove
	 */
	removeFile: (id: TFileInfer['id']) => void;
	/**
	 * Import data into the collection
	 * @param data - The data to import
	 */
	import: (data: TRESTData) => void;
};

const CTX = Symbol('REST_COLLECTION_CTX');
const STORAGE_KEY = 'collectionsREST';
const INITIAL_DATA: TRESTData = [];

/**
 * Set the REST context
 * @param initialData - The initial data to set
 * @param start - The start notifier to use
 */
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
			const newFile: TFileInfer = {
				...DEFAULT_FILE,
				id: file.id || generateUUID(),
				name: file.name
			};
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
		},
		import(data) {
			const newCollections = RESTRepository.setNewIDs(data);

			return store.update((state) => {
				state.push(...newCollections);
				saveData(state);
				return state;
			});
		}
	};

	const context = { ...store, ...actions } as TRESTContext;
	return setContext(CTX, context);
}

/**
 * Get the REST context
 * @returns The REST context
 */
export const getRESTContext = () => getContext<TRESTContext>(CTX);
