<script lang="ts" module>
	import { TreeWrapper } from './tree-wrapper';
	import type { TRESTCollectionInfer } from '$lib/schemas/collection';
</script>

<script lang="ts">
	

	interface Props {
		collections: Array<TRESTCollectionInfer>;
	}

	let { collections = [] }: Props = $props();
	
</script>

<div role="tree" class="-ml-2 flex flex-col p-2">
	<TreeWrapper type="collection" {folders} />
</div>
