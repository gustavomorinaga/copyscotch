import { writable } from 'svelte/store';
import type { TRESTRequestInfer } from '$lib/validators';

export type TRequestDeletionDialogStore = {
	open: boolean;
	requestID?: TRESTRequestInfer['id'];
};

export const alertDialogRequestDeletionStore = writable<TRequestDeletionDialogStore>({
	open: false,
	requestID: undefined
});
