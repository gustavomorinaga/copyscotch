import { writable } from 'svelte/store';
import type { TRESTRequestInfer } from '$lib/validators';

export type TSaveAsDialogStore = {
	open: boolean;
	request?: TRESTRequestInfer;
};

export const dialogSaveAsStore = writable<TSaveAsDialogStore>({
	open: false,
	request: undefined
});
