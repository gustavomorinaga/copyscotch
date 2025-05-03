<script lang="ts" module>
	import { TreeFolder } from '$lib/features/rest/components/trees/tree-collection/tree-folder';
	import { TreeFile } from '$lib/features/rest/components/trees/tree-collection/tree-file';
	import { FeedbackFolderEmpty } from '$lib/features/rest/components/feedbacks/feedback-folder-empty';
	import type { TRESTCollectionInfer } from '$lib/schemas/collection';
</script>

<script lang="ts">
	import Tree_wrapper_component from './tree-wrapper.component.svelte';
	

	interface Props {
		folders: Array<TRESTCollectionInfer>;
		type: 'collection' | 'folder';
	}

	let { folders = [], type = 'collection' }: Props = $props();
</script>

<ul role="group" class="flex shrink-0 flex-col">
	{#each folders as folder (folder.id)}
		{@const isFoldersEmpty = !folder.folders.length}
		{@const isRequestsEmpty = !folder.requests.length}
		{@const isEntireEmpty = isFoldersEmpty && isRequestsEmpty}

		<li class="flex shrink-0 flex-col">
			<TreeFolder {folder} {type}>
				<ul class="flex flex-1 flex-col">
					{#if isEntireEmpty}
						<li class="flex flex-col">
							<FeedbackFolderEmpty {folder} />
						</li>
					{:else}
						{#if folder.folders.length}
							<li class="flex flex-col">
								<Tree_wrapper_component type="folder" folders={folder.folders} />
							</li>
						{/if}

						{#each folder.requests as request (request.id)}
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
