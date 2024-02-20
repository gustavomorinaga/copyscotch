import { writable } from 'svelte/store';
import TreeSelect from './tree-select-collection.layout.svelte';

type TTreeSelectCollectionStore = {
	expand: boolean;
	collapse: boolean;
};

const treeSelectCollectionStore = writable<TTreeSelectCollectionStore>({
	expand: false,
	collapse: true
});

export { TreeSelect as TreeSelectCollection, treeSelectCollectionStore };
