<script lang="ts" context="module">
	import { derived, writable } from 'svelte/store';
	import { getRESTStore } from '$lib/stores';
	import { Separator } from '$lib/components/ui/separator';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import { FeedbackNotFound, InputSearch } from '$lib/layouts/shared';
	import {
		DialogEditCollection,
		FeedbackCollectionEmpty,
		ToolbarCollections,
		TreeCollection
	} from '$lib/layouts/rest';
</script>

<script lang="ts">
	const restStore = getRESTStore();
	const searchTerm = writable('');

	const filteredCollections = derived([restStore, searchTerm], ([$collections, $term]) => {
		if (!searchTerm) return $collections;
		return $collections.filter((collection) => collection.name.includes($term));
	});
</script>

<Breadcrumb.Root class="select-none">
	<Breadcrumb.Item>My Workspace</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item current>Collections</Breadcrumb.Item>
</Breadcrumb.Root>

<Separator orientation="horizontal" />

<InputSearch bind:value={$searchTerm} />

<Separator orientation="horizontal" />

<ToolbarCollections />

<Separator orientation="horizontal" />

{#if $filteredCollections.length}
	<TreeCollection collections={$filteredCollections} />
{:else if $searchTerm}
	<FeedbackNotFound term={$searchTerm} />
{:else}
	<FeedbackCollectionEmpty />
{/if}

<DialogEditCollection />
