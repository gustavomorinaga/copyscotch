import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { randomID } from '$lib/utils';
import type { TRESTRequest } from '$lib/ts';

type TRESTData = { requests: Array<TRESTRequest>; activeRequest: TRESTRequest['id'] };
type TRESTActions = {
	addRequest: () => void;
	updateRequest: (id: TRESTRequest['id'], request: Partial<TRESTRequest>) => void;
	setActiveRequest: (id: TRESTRequest['id']) => void;
	closeRequest: (id: TRESTRequest['id']) => void;
};
type TRESTStore = Writable<TRESTData> & TRESTActions;

const DEFAULT_REQUEST: Omit<TRESTRequest, 'id'> = {
	name: 'Untitled',
	url: 'https://jsonplaceholder.typicode.com/todos/1',
	method: 'GET'
};
const INITIAL_REQUEST = { ...DEFAULT_REQUEST, id: randomID() };

const REST_CTX = 'REST_CTX';
const REST_INITIAL_DATA: TRESTData = {
	requests: [INITIAL_REQUEST],
	activeRequest: INITIAL_REQUEST.id
};

export const setRESTStore = (initialData: Partial<TRESTData> = REST_INITIAL_DATA) => {
	const data: TRESTData = browser
		? JSON.parse(String(localStorage.getItem('rest'))) ?? initialData
		: initialData;
	const restStore = writable(data);

	const actions: TRESTActions = {
		addRequest: () => {
			restStore.update((state) => {
				const id = randomID();
				state.requests.push({ ...DEFAULT_REQUEST, id });
				state.activeRequest = id;
				return state;
			});
		},
		updateRequest: (id, request) => {
			restStore.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				state.requests[index] = { ...state.requests[index], ...request };
				return state;
			});
		},
		setActiveRequest: (id) => {
			restStore.update((state) => {
				state.activeRequest = id;
				return state;
			});
		},
		closeRequest: (id) => {
			restStore.update((state) => {
				const index = state.requests.findIndex((request) => request.id === id);
				state.requests = state.requests.filter((request) => request.id !== id);
				state.activeRequest = index === 0 ? state.requests[0]?.id : state.requests[index - 1]?.id;
				return state;
			});
		}
	};

	restStore.subscribe((state) => browser && localStorage.setItem('rest', JSON.stringify(state)));

	setContext(REST_CTX, { ...restStore, ...actions });
	return restStore;
};

export const getRESTStore = () => getContext<TRESTStore>(REST_CTX);
