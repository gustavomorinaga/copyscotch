<script lang="ts" context="module">
	import { TreeFolder } from '../tree-folder';
	import { TreeFile } from '../tree-file';
	import type { TRESTCollectionInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = {
		folders: Array<TRESTCollectionInfer>;
		type: 'collection' | 'folder';
		open?: boolean;
	};

	export let folders: $$Props['folders'] = [];
	export let type: $$Props['type'] = 'collection';
	export let open: $$Props['open'] = false;
</script>

<ul class="flex flex-col">
	{#each folders as folder}
		<TreeFolder {folder} {open} {type}>
			<ul class="flex flex-1 flex-col">
				{#if folder.folders.length}
					<svelte:self type="folder" folders={folder.folders} />
				{/if}

				{#each folder.requests as request}
					<TreeFile file={request} />
				{/each}
			</ul>
		</TreeFolder>
	{/each}
</ul>
