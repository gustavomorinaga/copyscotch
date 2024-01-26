<script lang="ts" context="module">
	import { TreeWrapper } from './tree-wrapper';
	import type { TRESTCollectionInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { collections: Array<TRESTCollectionInfer> };

	export let collections: $$Props['collections'] = [];
</script>

<div class="flex flex-col p-2">
	<TreeWrapper folders={collections} />
</div>
