<script lang="ts" context="module">
	import { TreeFolder, TreeFile } from '.';
	import type { TRESTCollectionInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { folders: Array<TRESTCollectionInfer> };

	export let folders: $$Props['folders'] = [];
</script>

<ul class="flex flex-col">
	{#each folders as folder}
		<TreeFolder {folder}>
			<ul class="flex flex-1 flex-col">
				{#if folder.folders.length}
					<svelte:self folders={folder.folders} />
				{/if}

				{#each folder.requests as request}
					<TreeFile file={request} />
				{/each}
			</ul>
		</TreeFolder>
	{/each}
</ul>
