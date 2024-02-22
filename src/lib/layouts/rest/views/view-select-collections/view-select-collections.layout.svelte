<script lang="ts" context="module">
	import { derived, writable } from 'svelte/store';
	import { getRESTContext } from '$lib/contexts';
	import { Separator } from '$lib/components/ui/separator';
	import { FeedbackNotFound, InputSearch } from '$lib/layouts/shared';
	import {
		treeSelectCollectionStore as treeStore,
		FeedbackCollectionEmpty,
		ToolbarSelectCollections
	} from '$lib/layouts/rest';
	import { RESTRepository } from '$lib/repositories';

	const LAZY_COMPONENTS = [
		import('$lib/layouts/rest/trees/tree-select-collection').then((m) => m.TreeSelectCollection),
		import('$lib/layouts/rest/alert-dialogs/alert-dialog-collection-deletion').then(
			(m) => m.AlertDialogCollectionDeletion
		),
		import('$lib/layouts/rest/alert-dialogs/alert-dialog-request-deletion').then(
			(m) => m.AlertDialogRequestDeletion
		)
	] as const;
</script>

<script lang="ts">
	const restContext = getRESTContext();

	const searchTerm = writable('');
	const tree = derived(restContext, ($collections) => structuredClone($collections));
	const filteredCollections = derived([tree, searchTerm], ([$tree, $term]) => {
		if (!$term) return $tree;
		return RESTRepository.filterTree($tree, $term);
	});

	$: $treeStore.expand = Boolean($searchTerm);
</script>

<div class="sticky top-[2.0625rem] z-10 inline-flex w-full shrink-0 flex-col">
	<InputSearch class="bg-background" bind:value={$searchTerm} />
	<Separator orientation="horizontal" />
</div>

<div class="sticky top-[4.125rem] z-10 inline-flex w-full shrink-0 flex-col">
	<ToolbarSelectCollections />
	<Separator orientation="horizontal" />
</div>

{#if $filteredCollections.length}
	{#await Promise.all(LAZY_COMPONENTS) then [TreeSelectCollection, AlertDialogCollectionDeletion, AlertDialogRequestDeletion]}
		<TreeSelectCollection collections={$filteredCollections} />
		<AlertDialogCollectionDeletion />
		<AlertDialogRequestDeletion />
	{/await}
{:else if $searchTerm}
	<FeedbackNotFound term={$searchTerm} />
{:else}
	<FeedbackCollectionEmpty />
{/if}
