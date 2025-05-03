<script lang="ts" module>
	import { onDestroy } from 'svelte';
	import { treeSelectCollectionStore as treeStore } from './store';
	import { TreeWrapper } from './tree-wrapper';
	import type { TRESTCollectionInfer } from '$lib/schemas/collection';
</script>

<script lang="ts">
	

	interface Props {
		collections: Array<TRESTCollectionInfer>;
	}

	let { collections = [] }: Props = $props();
	

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
