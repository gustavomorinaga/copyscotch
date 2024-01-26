<script lang="ts" context="module">
	import { getRESTStore } from '$lib/stores';
	import { Separator } from '$lib/components/ui/separator';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import {
		DialogEditCollection,
		FeedbackCollectionEmpty,
		ToolbarCollections,
		TreeCollection
	} from '$lib/layouts/rest';
</script>

<script lang="ts">
	const restStore = getRESTStore();
</script>

<Breadcrumb.Root class="select-none">
	<Breadcrumb.Item>My Workspace</Breadcrumb.Item>
	<Breadcrumb.Separator />
	<Breadcrumb.Item current>Collections</Breadcrumb.Item>
</Breadcrumb.Root>

<Separator orientation="horizontal" />

<ToolbarCollections />

<Separator orientation="horizontal" />

<div class="flex flex-col p-2">
	{#if $restStore.length}
		<TreeCollection folders={$restStore} />
	{:else}
		<FeedbackCollectionEmpty />
	{/if}
</div>

<DialogEditCollection />
