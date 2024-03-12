<script lang="ts" context="module">
	import { onDestroy } from 'svelte';
	import { treeSelectCollectionStore as treeStore, type TTreeSelectCollectionStore } from './store';
	import { TreeWrapper } from './tree-wrapper';
	import type { TRESTCollectionInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { collections: Array<TRESTCollectionInfer> };

	let folders: $$Props['collections'] = [];
	export { folders as collections };

	$: if ($treeStore.collapse) {
		const arrayField: keyof TTreeSelectCollectionStore = $treeStore.expand
			? 'expandedFolders'
			: 'openedFolders';
		$treeStore[arrayField] = [];
	}

	onDestroy(() => {
		treeStore.set({
			expand: false,
			collapse: true,
			selectedID: undefined,
			selectedType: undefined,
			openedFolders: [],
			expandedFolders: []
		});
	});
</script>

<div role="tree" class="-ml-2 flex flex-1 flex-col p-2">
	<TreeWrapper type="collection" {folders} />
</div>
