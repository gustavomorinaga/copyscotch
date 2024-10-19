import { writable } from 'svelte/store';
import type { TRESTCollectionInfer } from '$lib/schemas/collection';

export type TCollectionDeletionDialogStore = {
	open: boolean;
	collectionID?: TRESTCollectionInfer['id'];
};

export const alertDialogCollectionDeletionStore = writable<TCollectionDeletionDialogStore>({
	open: false,
	collectionID: undefined
});
