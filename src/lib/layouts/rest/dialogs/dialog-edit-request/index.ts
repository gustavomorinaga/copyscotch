import { writable } from 'svelte/store';
import type { TRESTRequestInfer } from '$lib/validators';
import Dialog from './dialog-edit-request.layout.svelte';

type TRequestDialogStore = {
	open: boolean;
	request?: TRESTRequestInfer;
	mode: 'create' | 'edit';
};

const dialogEditRequestStore = writable<TRequestDialogStore>({
	open: false,
	request: undefined,
	mode: 'create'
});

export { Dialog as DialogEditRequest, dialogEditRequestStore };
