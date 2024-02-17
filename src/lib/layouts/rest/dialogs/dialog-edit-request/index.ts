import { writable } from 'svelte/store';
import type { TRESTCollectionInfer, TRESTRequestInfer } from '$lib/validators';
import Dialog from './dialog-edit-request.layout.svelte';

export type TRequestDialogStore = {
	open: boolean;
	mode: 'create' | 'edit';
	collectionID?: TRESTCollectionInfer['id'];
	request?: TRESTRequestInfer;
	forceSave?: boolean;
};

const dialogEditRequestStore = writable<TRequestDialogStore>({
	open: false,
	mode: 'create',
	collectionID: undefined,
	request: undefined,
	forceSave: false
});

export { Dialog as DialogEditRequest, dialogEditRequestStore };
