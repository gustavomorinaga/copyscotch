<script lang="ts" context="module">
	import { treeCollectionStore as treeStore } from './store';
	import { TreeWrapper } from './tree-wrapper';
	import type { TFolderInfer, TRESTCollectionInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { collections: Array<TRESTCollectionInfer> };

	let folders: $$Props['collections'] = [];
	export { folders as collections };

	$: if (folders.length) $treeStore.collectionsIDs = folders.map((folder) => folder.id);
	$: if ($treeStore.collapse) $treeStore.openedFolders = [];
	$: if ($treeStore.expand) $treeStore.openedFolders = retrieveFolderIDs(folders);

	function retrieveFolderIDs(folders: Array<TFolderInfer>) {
		let folderIDs: Array<TFolderInfer['id']> = [];

		function retrieve(folder: TFolderInfer) {
			folderIDs.push(folder.id);
			if (folder.folders.length) folder.folders.forEach(retrieve);
		}

		folders.forEach(retrieve);

		return [...new Set(folderIDs)];
	}
</script>

<div role="tree" class="-ml-2 flex flex-col p-2">
	<TreeWrapper type="collection" {folders} />
</div>
