import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { randomID } from '$lib/utils';
import type { TRESTRequest } from '$lib/ts';

type TRESTState = { requests: Array<TRESTRequest> };
type TRESTActions = {
	addRequest: () => void;
	closeRequest: (id: TRESTRequest['id']) => void;
};
type TRESTStore = Writable<TRESTState> & TRESTActions;

const DEFAULT_REQUEST: Omit<TRESTRequest, 'id'> = {
	name: 'Untitled',
	url: 'https://jsonplaceholder.typicode.com/todos/1',
	method: 'GET'
};

const REST_CTX = 'REST_CTX';
const REST_INITIAL_STATE: TRESTState = {
	requests: [{ ...DEFAULT_REQUEST, id: randomID() }]
};

export const setRESTStore = (initialData: Partial<TRESTState> = REST_INITIAL_STATE) => {
	const restStore = writable(initialData as TRESTState);

	const actions = {
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

	setContext(REST_CTX, { ...restStore, ...actions });
	return restStore;
};

export const getRESTStore = () => getContext<TRESTStore>(REST_CTX);
