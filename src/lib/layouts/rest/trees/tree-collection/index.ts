import { writable } from 'svelte/store';
import Tree from './tree-collection.layout.svelte';

type TTreeCollectionStore = {
	expand: boolean;
	collapse: boolean;
};

const treeCollectionStore = writable<TTreeCollectionStore>({
	expand: false,
	collapse: true
});

export { Tree as TreeCollection, treeCollectionStore };
