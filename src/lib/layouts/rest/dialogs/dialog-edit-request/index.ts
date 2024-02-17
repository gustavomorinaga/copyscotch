import { writable } from 'svelte/store';
import type { TRESTCollectionInfer, TRESTRequestInfer } from '$lib/validators';
import Dialog from './dialog-edit-request.layout.svelte';

export type TRequestDialogStore = {
	open: boolean;
	collectionID?: TRESTCollectionInfer['id'];
	request?: TRESTRequestInfer;
	mode: 'create' | 'edit';
};

const dialogEditRequestStore = writable<TRequestDialogStore>({
	open: false,
	collectionID: undefined,
	request: undefined,
	mode: 'create'
});

export { Dialog as DialogEditRequest, dialogEditRequestStore };
