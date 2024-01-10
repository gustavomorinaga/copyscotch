import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { get, writable, type StartStopNotifier, type Writable } from 'svelte/store';
import { randomID } from '$lib/utils';
import type { TRESTRequestSchemaInfer } from '$lib/validators';

type TRESTDataTemp = {
	editRequest?: TRESTRequestSchemaInfer['id'];
};
type TRESTDataPersist = {
	requests: Array<TRESTRequestSchemaInfer>;
	activeRequest: TRESTRequestSchemaInfer['id'];
};
type TRESTData = TRESTDataPersist & TRESTDataTemp;
type TRESTActions = {
	addRequest: () => void;
	getRequest: (id: TRESTRequestSchemaInfer['id']) => TRESTRequestSchemaInfer | undefined;
	setActiveRequest: (id: TRESTRequestSchemaInfer['id']) => void;
	setEditRequest: (id: TRESTRequestSchemaInfer['id'] | undefined) => void;
	closeRequest: (id: TRESTRequestSchemaInfer['id']) => void;
	closeOtherRequests: (id: TRESTRequestSchemaInfer['id']) => void;
	duplicateRequest: (id: TRESTRequestSchemaInfer['id']) => void;
	updateRequest: (
		id: TRESTRequestSchemaInfer['id'],
		request: Partial<TRESTRequestSchemaInfer>
	) => void;
};
type TRESTStore = Writable<TRESTData> & TRESTActions;

const REST_CTX = 'REST_CTX';
const REST_STORAGE_KEY = 'collectionsREST';
const DEFAULT_REQUEST: Omit<TRESTRequestSchemaInfer, 'id'> = {
	name: 'Untitled',
	url: 'https://jsonplaceholder.typicode.com/todos/1',
	method: 'GET'
};
const INITIAL_REQUEST = { ...DEFAULT_REQUEST, id: randomID() };
const REST_INITIAL_DATA: TRESTData = {
	requests: [INITIAL_REQUEST],
	activeRequest: INITIAL_REQUEST.id
};

export const setRESTStore = (
	initialData: Partial<TRESTData> = REST_INITIAL_DATA,
	start: StartStopNotifier<TRESTData> = () => {}
) => {
	let channel: BroadcastChannel | null;

	const data: TRESTData = browser
		? JSON.parse(String(localStorage.getItem(REST_STORAGE_KEY))) ?? initialData
		: initialData;

	const store = writable(data, (set, update) => {
		channel = new BroadcastChannel(REST_STORAGE_KEY);
		channel.addEventListener('message', ({ data }) => {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			const { editRequest, ...dataPersist } = data as TRESTData;
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

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { editRequest, ...dataPersist } = data;

		localStorage.setItem(REST_STORAGE_KEY, JSON.stringify(dataPersist));
		channel?.postMessage(data);
	}

	const actions: TRESTActions = {
		addRequest: () => {
			store.update((state) => {
				const generatedID = randomID();
				state.requests.push({ ...DEFAULT_REQUEST, id: generatedID });
				state.activeRequest = generatedID;
				saveData(state);
				return state;
			});
		},
		getRequest: (id) => {
			const { requests } = get(store);
			return requests.find((request) => request.id === id);
		},
		updateRequest: (id, request) => {
			store.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				state.requests[index] = { ...state.requests[index], ...request };
				saveData(state);
				return state;
			});
		},
		duplicateRequest: (id) => {
			store.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				const request = state.requests[index];
				const generatedID = randomID();
				state.requests.splice(index + 1, 0, { ...structuredClone(request), id: generatedID });
				state.activeRequest = generatedID;
				saveData(state);
				return state;
			});
		},
		setActiveRequest: (id) => {
			store.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				state.activeRequest = id;
				saveData(state);
				return state;
			});
		},
		setEditRequest: (id) => {
			store.update((state) => {
				if (!id) {
					state.editRequest = undefined;
					saveData(state);
					return state;
				}

				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				state.editRequest = id;
				saveData(state);
				return state;
			});
		},
		closeRequest: (id) => {
			store.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				state.requests = state.requests.filter((request) => request.id !== id);
				state.activeRequest = index === 0 ? state.requests[0]?.id : state.requests[index - 1]?.id;
				saveData(state);
				return state;
			});
		},
		closeOtherRequests: (id) => {
			store.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				state.requests = [state.requests[index]];
				state.activeRequest = id;
				saveData(state);
				return state;
			});
		}
	};

	setContext(REST_CTX, { ...store, ...actions });
	return store;
};

export const getRESTStore = () => getContext<TRESTStore>(REST_CTX);
