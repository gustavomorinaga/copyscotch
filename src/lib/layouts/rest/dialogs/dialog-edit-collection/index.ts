import { writable } from 'svelte/store';
import type { TRESTCollectionInfer } from '$lib/validators';
import Dialog from './dialog-edit-collection.layout.svelte';

export type TCollectionDialogStore = {
	open: boolean;
	parentID?: TRESTCollectionInfer['id'];
	collection?: TRESTCollectionInfer;
	mode: 'create' | 'edit';
	type: 'collection' | 'folder';
};

const dialogEditCollectionStore = writable<TCollectionDialogStore>({
	open: false,
	parentID: undefined,
	collection: undefined,
	mode: 'create',
	type: 'collection'
});

export { Dialog as DialogEditCollection, dialogEditCollectionStore };
