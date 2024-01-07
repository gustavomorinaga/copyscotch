import { browser } from '$app/environment';
import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { randomID } from '$lib/utils';
import type { TRESTRequest } from '$lib/ts';

type TRESTData = { requests: Array<TRESTRequest> };
type TRESTActions = {
	addRequest: () => void;
	closeRequest: (id: TRESTRequest['id']) => void;
};
type TRESTStore = Writable<TRESTData> & TRESTActions;

const DEFAULT_REQUEST: Omit<TRESTRequest, 'id'> = {
	name: 'Untitled',
	url: 'https://jsonplaceholder.typicode.com/todos/1',
	method: 'GET'
};

const REST_CTX = 'REST_CTX';
const REST_INITIAL_DATA: TRESTData = {
	requests: [{ ...DEFAULT_REQUEST, id: randomID() }]
};

export const setRESTStore = (initialData: Partial<TRESTData> = REST_INITIAL_DATA) => {
	const data: TRESTData = browser
		? JSON.parse(String(localStorage.getItem('rest'))) ?? initialData
		: initialData;
	const restStore = writable(data);

	const actions: TRESTActions = {
		addRequest: () =>
			restStore.update((state) => {
				state.requests.push({ ...DEFAULT_REQUEST, id: randomID() });
				return state;
			}),
		closeRequest: (id: TRESTRequest['id']) =>
			restStore.update((state) => {
				state.requests = state.requests.filter((request) => request.id !== id);
				return state;
			})
	};

	restStore.subscribe((state) => browser && localStorage.setItem('rest', JSON.stringify(state)));

	setContext(REST_CTX, { ...restStore, ...actions });
	return restStore;
};

export const getRESTStore = () => getContext<TRESTStore>(REST_CTX);
