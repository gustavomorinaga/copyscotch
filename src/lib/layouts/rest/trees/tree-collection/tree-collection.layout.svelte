<script lang="ts" context="module">
	import { treeCollectionStore as treeStore } from '.';
	import { TreeWrapper } from './tree-wrapper';
	import type { TRESTCollectionInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { collections: Array<TRESTCollectionInfer> };

	export let collections: $$Props['collections'] = [];
	let open = !$treeStore.collapse;
</script>

<div class="flex flex-col p-2">
	<TreeWrapper type="collection" folders={collections.map((rest) => ({ ...rest, open }))} />
</div>
