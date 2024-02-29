<script lang="ts" context="module">
	import { derived, writable } from 'svelte/store';
	import { getRESTContext } from '$lib/contexts';
	import { Separator } from '$lib/components/ui/separator';
	import { treeCollectionStore as treeStore } from '$lib/layouts/rest/trees/tree-collection';
	import { ToolbarCollections } from '$lib/layouts/rest/toolbars/toolbar-collections';
	import { InputSearch } from '$lib/layouts/shared';
	import { RESTRepository } from '$lib/repositories';

	const LAZY_COMPONENTS = [
		import('$lib/layouts/rest/trees/tree-collection'),
		import('$lib/layouts/rest/alert-dialogs/alert-dialog-collection-deletion'),
		import('$lib/layouts/rest/alert-dialogs/alert-dialog-request-deletion')
	] as const;

	const LAZY_FEEDBACK_NOT_FOUND = import('$lib/layouts/shared/feedbacks/feedback-not-found');
	const LAZY_FEEDBACK_COLLECTION_EMPTY = import(
		'$lib/layouts/rest/feedbacks/feedback-collection-empty'
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

	$: $treeStore.expand = Boolean($searchTerm);
</script>

<div class="sticky top-[2.0625rem] z-10 inline-flex w-full shrink-0 flex-col">
	<InputSearch class="bg-background" bind:value={$searchTerm} />
	<Separator orientation="horizontal" />
</div>

<div class="sticky top-[4.125rem] z-10 inline-flex w-full shrink-0 flex-col">
	<ToolbarCollections />
	<Separator orientation="horizontal" />
</div>

{#if $filteredCollections.length}
	{#await Promise.all(LAZY_COMPONENTS) then [{ TreeCollection }, ...loadedComponents]}
		<TreeCollection collections={$filteredCollections} />

		{#each loadedComponents as component}
			<svelte:component this={component.default} />
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
