import { writable } from 'svelte/store';
import type { TRESTCollectionInfer } from '$lib/schemas/collection';
import type { TRESTRequestInfer } from '$lib/schemas/rest';

export type TRequestDialogStore = {
	open: boolean;
	mode: 'create' | 'edit';
	collectionID?: TRESTCollectionInfer['id'];
	request?: TRESTRequestInfer;
	forceSave?: boolean;
};

export const dialogEditRequestStore = writable<TRequestDialogStore>({
	open: false,
	mode: 'create',
	collectionID: undefined,
	request: undefined,
	forceSave: false
});
