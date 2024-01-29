import { writable } from 'svelte/store';
import Tree from './tree-collection.layout.svelte';

type TTreeCollectionStore = {
	collapse: boolean;
};

const treeCollectionStore = writable<TTreeCollectionStore>({
	collapse: true
});

export { Tree as TreeCollection, treeCollectionStore };
