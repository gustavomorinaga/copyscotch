import type { TFolderInfer, TFileInfer } from '$lib/validators';
import { writable } from 'svelte/store';

export type TTreeSelectCollectionStore = {
	expand: boolean;
	collapse: boolean;
	selectedID?: TFolderInfer['id'] | TFileInfer['id'];
	selectedType?: 'folder' | 'file';
	openedFolders: Array<TFolderInfer['id']>;
	expandedFolders: Array<TFolderInfer['id']>;
};

export const treeSelectCollectionStore = writable<TTreeSelectCollectionStore>({
	expand: false,
	collapse: true,
	selectedID: undefined,
	selectedType: undefined,
	openedFolders: [],
	expandedFolders: []
});
