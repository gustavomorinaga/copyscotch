import { writable } from 'svelte/store';
import type { TRESTRequestInfer } from '$lib/validators';
import Dialog from './dialog-save-as.layout.svelte';

export type TSaveAsDialogStore = {
	open: boolean;
	request?: TRESTRequestInfer;
};

const dialogSaveAsStore = writable<TSaveAsDialogStore>({
	open: false,
	request: undefined
});

export { Dialog as DialogSaveAs, dialogSaveAsStore };
