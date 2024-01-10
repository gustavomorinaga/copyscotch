import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { get, writable, type Writable } from 'svelte/store';
import { randomID } from '$lib/utils';
import type { TRESTRequestSchemaInfer } from '$lib/validators';

type TRESTData = {
	requests: Array<TRESTRequestSchemaInfer>;
	activeRequest: TRESTRequestSchemaInfer['id'];
	editRequest?: TRESTRequestSchemaInfer['id'];
	predictedRequest?: TRESTRequestSchemaInfer['id'];
};
type TRESTActions = {
	addRequest: () => void;
	getRequest: (id: TRESTRequestSchemaInfer['id']) => TRESTRequestSchemaInfer | undefined;
	setActiveRequest: (id: TRESTRequestSchemaInfer['id']) => void;
	setEditRequest: (id: TRESTRequestSchemaInfer['id'] | undefined) => void;
	setPredictedRequest: (id: TRESTRequestSchemaInfer['id'] | undefined) => void;
	closeRequest: (id: TRESTRequestSchemaInfer['id']) => void;
	closeOtherRequests: (id: TRESTRequestSchemaInfer['id']) => void;
	duplicateRequest: (id: TRESTRequestSchemaInfer['id']) => void;
	updateRequest: (
		id: TRESTRequestSchemaInfer['id'],
		request: Partial<TRESTRequestSchemaInfer>
	) => void;
};
type TRESTStore = Writable<TRESTData> & TRESTActions;

const DEFAULT_REQUEST: Omit<TRESTRequestSchemaInfer, 'id'> = {
	name: 'Untitled',
	url: 'https://jsonplaceholder.typicode.com/todos/1',
	method: 'GET'
};
const INITIAL_REQUEST = { ...DEFAULT_REQUEST, id: randomID() };

const REST_CTX = 'REST_CTX';
const REST_STORAGE_KEY = 'collectionsREST';
const REST_INITIAL_DATA: TRESTData = {
	requests: [INITIAL_REQUEST],
	activeRequest: INITIAL_REQUEST.id
};

export const setRESTStore = (initialData: Partial<TRESTData> = REST_INITIAL_DATA) => {
	const data: TRESTData = browser
		? JSON.parse(String(localStorage.getItem(REST_STORAGE_KEY))) ?? initialData
		: initialData;
	const restStore = writable(data);

	const actions: TRESTActions = {
		addRequest: () => {
			restStore.update((state) => {
				const generatedID = randomID();
				state.requests.push({ ...DEFAULT_REQUEST, id: generatedID });
				state.activeRequest = generatedID;
				return state;
			});
		},
		getRequest: (id) => {
			const { requests } = get(restStore);
			return requests.find((request) => request.id === id);
		},
		updateRequest: (id, request) => {
			restStore.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				state.requests[index] = { ...state.requests[index], ...request };
				return state;
			});
		},
		duplicateRequest: (id) => {
			restStore.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				const request = state.requests[index];
				const generatedID = randomID();
				state.requests.splice(index + 1, 0, { ...structuredClone(request), id: generatedID });
				state.activeRequest = generatedID;
				return state;
			});
		},
		setActiveRequest: (id) => {
			restStore.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				state.activeRequest = id;
				return state;
			});
		},
		setEditRequest: (id) => {
			restStore.update((state) => {
				if (!id) {
					state.editRequest = undefined;
					return state;
				}

				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				state.editRequest = id;
				return state;
			});
		},
		setPredictedRequest: (id) => {
			restStore.update((state) => {
				if (!id) {
					state.predictedRequest = undefined;
					return state;
				}

				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				state.predictedRequest = id;
				return state;
			});
		},
		closeRequest: (id) => {
			restStore.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				state.requests = state.requests.filter((request) => request.id !== id);
				state.activeRequest = index === 0 ? state.requests[0]?.id : state.requests[index - 1]?.id;
				return state;
			});
		},
		closeOtherRequests: (id) => {
			restStore.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				if (index === -1) return state;

				state.requests = [state.requests[index]];
				state.activeRequest = id;
				return state;
			});
		}
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	restStore.subscribe(({ editRequest, predictedRequest, ...state }) => {
		if (browser) localStorage.setItem(REST_STORAGE_KEY, JSON.stringify(state));
	});

	setContext(REST_CTX, { ...restStore, ...actions });
	return restStore;
};

export const getRESTStore = () => getContext<TRESTStore>(REST_CTX);
