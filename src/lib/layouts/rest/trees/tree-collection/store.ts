import { writable } from 'svelte/store';
import type { TFolderInfer, TFileInfer } from '$lib/validators';

export type TTreeCollectionStore = {
	expand: boolean;
	collapse: boolean;
	selected?: TFolderInfer['id'] | TFileInfer['id'];
	openedFolders: Array<TFolderInfer['id']>;
	expandedFolders: Array<TFolderInfer['id']>;
};

export const treeCollectionStore = writable<TTreeCollectionStore>({
	expand: false,
	collapse: false,
	selected: undefined,
	openedFolders: [],
	expandedFolders: []
});
