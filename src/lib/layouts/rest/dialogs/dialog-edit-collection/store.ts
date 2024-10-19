import { writable } from 'svelte/store';
import type { TRESTCollectionInfer } from '$lib/schemas/collection';

export type TCollectionDialogStore = {
	open: boolean;
	parentID?: TRESTCollectionInfer['id'];
	collection?: TRESTCollectionInfer;
	mode: 'create' | 'edit';
	type: 'collection' | 'folder';
};

export const dialogEditCollectionStore = writable<TCollectionDialogStore>({
	open: false,
	parentID: undefined,
	collection: undefined,
	mode: 'create',
	type: 'collection'
});
