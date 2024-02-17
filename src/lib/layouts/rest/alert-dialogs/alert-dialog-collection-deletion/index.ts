import { writable } from 'svelte/store';
import type { TRESTCollectionInfer } from '$lib/validators';
import AlertDialog from './alert-dialog-collection-deletion.layout.svelte';

export type TCollectionDeletionDialogStore = {
	open: boolean;
	collectionID?: TRESTCollectionInfer['id'];
};

const alertDialogCollectionDeletionStore = writable<TCollectionDeletionDialogStore>({
	open: false,
	collectionID: undefined
});

export { AlertDialog as AlertDialogCollectionDeletion, alertDialogCollectionDeletionStore };
