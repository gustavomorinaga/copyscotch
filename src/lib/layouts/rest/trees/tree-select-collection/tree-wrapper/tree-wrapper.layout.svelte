<script lang="ts" context="module">
	import { TreeFolder } from '../tree-folder';
	import { TreeFile } from '../tree-file';
	import { FeedbackFolderEmpty } from '$lib/layouts/rest/feedbacks/feedback-folder-empty';
	import type { TRESTCollectionInfer } from '$lib/schemas/collection';
</script>

<script lang="ts">
	type $$Props = {
		folders: Array<TRESTCollectionInfer>;
		type: 'collection' | 'folder';
	};

	export let folders: $$Props['folders'] = [];
	export let type: $$Props['type'] = 'collection';
</script>

<ul role="group" class="flex shrink-0 flex-col">
	{#each folders as folder}
		{@const isEmpty = !folder.folders.length && !folder.requests.length}

		<li class="flex shrink-0 flex-col">
			<TreeFolder {folder} {type}>
				<ul class="flex flex-1 flex-col">
					{#if isEmpty}
						<li class="flex flex-col">
							<FeedbackFolderEmpty {folder} />
						</li>
					{:else}
						{#if folder.folders.length}
							<li class="flex flex-col">
								<svelte:self type="folder" folders={folder.folders} />
							</li>
						{/if}

						{#each folder.requests as request}
							<li class="flex">
								<TreeFile file={request} />
							</li>
						{/each}
					{/if}
				</ul>
			</TreeFolder>
		</li>
	{/each}
</ul>
