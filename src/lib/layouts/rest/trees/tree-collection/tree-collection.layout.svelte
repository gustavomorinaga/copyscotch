<script lang="ts" context="module">
	import { treeCollectionStore as treeStore, type TTreeCollectionStore } from './store';
	import { TreeWrapper } from './tree-wrapper';
	import { retrieveNestedFields } from '$lib/utils';
	import type { TRESTCollectionInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { collections: Array<TRESTCollectionInfer> };

	let folders: $$Props['collections'] = [];
	export { folders as collections };

	$: if ($treeStore.collapse) {
		const arrayField: keyof TTreeCollectionStore = $treeStore.expand
			? 'expandedFolders'
			: 'openedFolders';
		$treeStore[arrayField] = [];
	}
</script>

<div role="tree" class="-ml-2 flex flex-col p-2">
	<TreeWrapper type="collection" {folders} />
</div>
