<script lang="ts" context="module">
	import { derived, writable } from 'svelte/store';
	import { getRESTStore } from '$lib/stores';
	import { Separator } from '$lib/components/ui/separator';
	import { FeedbackNotFound, InputSearch } from '$lib/layouts/shared';
	import {
		DialogEditCollection,
		FeedbackCollectionEmpty,
		ToolbarCollections
	} from '$lib/layouts/rest';
	import { RESTRepository } from '$lib/repositories';

	const LAZY_COMPONENTS = [
		import('$lib/layouts/rest/trees/tree-collection').then((m) => m.TreeCollection),
		import('$lib/layouts/rest/alert-dialogs/alert-dialog-collection-deletion').then(
			(m) => m.AlertDialogCollectionDeletion
		),
		import('$lib/layouts/rest/alert-dialogs/alert-dialog-request-deletion').then(
			(m) => m.AlertDialogRequestDeletion
		)
	] as const;
</script>

<script lang="ts">
	const restStore = getRESTStore();

	const searchTerm = writable('');
	const tree = derived(restStore, ($collections) => structuredClone($collections));
	const filteredCollections = derived([tree, searchTerm], ([$tree, $term]) => {
		if (!$term) return $tree;
		return RESTRepository.filterTree($tree, $term);
	});
</script>

<Separator orientation="horizontal" />

<InputSearch class="bg-background" bind:value={$searchTerm} />

<Separator orientation="horizontal" />

<ToolbarCollections />

<Separator orientation="horizontal" />

{#if $filteredCollections.length}
	{#await Promise.all(LAZY_COMPONENTS) then [TreeCollection, AlertDialogCollectionDeletion, AlertDialogRequestDeletion]}
		<TreeCollection collections={$filteredCollections} />
		<AlertDialogCollectionDeletion />
		<AlertDialogRequestDeletion />
	{/await}
{:else if $searchTerm}
	<FeedbackNotFound term={$searchTerm} />
{:else}
	<FeedbackCollectionEmpty />
{/if}

<DialogEditCollection />
