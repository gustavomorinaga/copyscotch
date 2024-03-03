<script lang="ts" context="module">
	import { TreeWrapper } from './tree-wrapper';
	import type { TRESTCollectionInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { collections: Array<TRESTCollectionInfer> };

	let folders: $$Props['collections'] = [];
	export { folders as collections };
</script>

<div role="tree" class="-ml-2 flex flex-col p-2">
	<TreeWrapper type="collection" {folders} />
</div>
