import { writable } from 'svelte/store';
import type { TRESTCollectionInfer } from '$lib/validators';
import Dialog from './dialog-edit-collection.layout.svelte';

type TCollectionDialogStore = {
	open: boolean;
	collection?: TRESTCollectionInfer;
	mode: 'create' | 'edit';
};

const dialogEditCollectionStore = writable<TCollectionDialogStore>({
	open: false,
	collection: undefined,
	mode: 'create'
});

export { Dialog as DialogEditCollection, dialogEditCollectionStore };
