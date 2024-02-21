import type { TFolderInfer, TFileInfer } from '$lib/validators';
import { writable } from 'svelte/store';

export type TTreeSelectCollectionStore = {
	expand: boolean;
	collapse: boolean;
	selectedID?: TFolderInfer['id'] | TFileInfer['id'];
	selectedType?: 'folder' | 'file';
};

export const treeSelectCollectionStore = writable<TTreeSelectCollectionStore>({
	expand: false,
	collapse: true,
	selectedID: undefined,
	selectedType: undefined
});
