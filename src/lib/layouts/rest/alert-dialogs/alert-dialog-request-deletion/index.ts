import { writable } from 'svelte/store';
import type { TRESTRequestInfer } from '$lib/validators';
import AlertDialog from './alert-dialog-request-deletion.layout.svelte';

export type TRequestDeletionDialogStore = {
	open: boolean;
	requestID?: TRESTRequestInfer['id'];
};

const alertDialogRequestDeletionStore = writable<TRequestDeletionDialogStore>({
	open: false,
	requestID: undefined
});

export { AlertDialog as AlertDialogRequestDeletion, alertDialogRequestDeletionStore };
