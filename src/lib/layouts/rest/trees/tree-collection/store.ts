import { writable } from 'svelte/store';

export type TTreeCollectionStore = {
	expand: boolean;
	collapse: boolean;
};

export const treeCollectionStore = writable<TTreeCollectionStore>({
	expand: false,
	collapse: true
});
