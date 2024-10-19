<script lang="ts" context="module">
	import { derived, writable } from 'svelte/store';
	import { getRESTContext } from '$lib/contexts/rest';
	import { RESTRepository } from '$lib/repositories/rest';
	import { retrieveNestedFields } from '$lib/utils/mapper';
	import { treeCollectionStore as treeStore } from '$lib/features/rest/components/trees/tree-collection';
	import { ToolbarCollections } from '$lib/features/rest/components/toolbars/toolbar-collections';
	import { InputSearch } from '$lib/components/infra/inputs/input-search';
	import { Separator } from '$lib/components/ui/separator';

	const LAZY_COMPONENTS = [
		import('$lib/features/rest/components/trees/tree-collection').then(
			(module) => module.TreeCollection
		),
		import('$lib/features/rest/components/alert-dialogs/alert-dialog-collection-deletion').then(
			(module) => module.AlertDialogCollectionDeletion
		),
		import('$lib/features/rest/components/alert-dialogs/alert-dialog-request-deletion').then(
			(module) => module.AlertDialogRequestDeletion
		)
	] as const;

	const LAZY_FEEDBACK_NOT_FOUND = import('$lib/components/infra/feedbacks/feedback-not-found');
	const LAZY_FEEDBACK_COLLECTION_EMPTY = import(
		'$lib/features/rest/components/feedbacks/feedback-collection-empty'
	);
</script>

<script lang="ts">
	const restContext = getRESTContext();

	const searchTerm = writable('');
	const tree = derived(restContext, ($collections) => structuredClone($collections));
	const filteredCollections = derived([tree, searchTerm], ([$tree, $term]) => {
		if (!$term) return $tree;
		return RESTRepository.filterTree($tree, $term);
	});

	$: {
		const hasTerm = Boolean($searchTerm);

		$treeStore.expand = hasTerm;
		$treeStore.expandedFolders = hasTerm
			? retrieveNestedFields($filteredCollections, 'folders', 'id')
			: [];
	}
</script>

<div class="sticky top-[2.350rem] z-10 inline-flex w-full shrink-0 flex-col">
	<InputSearch class="bg-background" bind:value={$searchTerm} />
	<Separator orientation="horizontal" />
</div>

<div class="sticky top-[4.675rem] z-10 inline-flex w-full shrink-0 flex-col">
	<ToolbarCollections />
	<Separator orientation="horizontal" />
</div>

{#if $filteredCollections.length}
	{#await Promise.all(LAZY_COMPONENTS) then [TreeCollection, ...loadedComponents]}
		<TreeCollection collections={$filteredCollections} />

		{#each loadedComponents as component}
			<svelte:component this={component} />
		{/each}
	{/await}
{:else if $searchTerm}
	{#await LAZY_FEEDBACK_NOT_FOUND then { FeedbackNotFound }}
		<FeedbackNotFound term={$searchTerm} />
	{/await}
{:else}
	{#await LAZY_FEEDBACK_COLLECTION_EMPTY then { FeedbackCollectionEmpty }}
		<FeedbackCollectionEmpty />
	{/await}
{/if}
