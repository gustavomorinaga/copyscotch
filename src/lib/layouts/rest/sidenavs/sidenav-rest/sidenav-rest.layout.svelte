<script lang="ts" context="module">
	import { getRESTStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { FeedbackCollectionEmpty } from '$lib/layouts/rest/feedbacks';
	import { DialogEditCollection, dialogStore } from '$lib/layouts/rest/dialogs';
	import { TreeCollection } from '$lib/layouts/rest/trees';
	import { ChevronRight, Plus } from 'lucide-svelte';
</script>

<script lang="ts">
	const restStore = getRESTStore();

	function handleNewCollection() {
		$dialogStore.open = true;
		$dialogStore.mode = 'create';
	}
</script>

<div
	class="inline-flex select-none items-center gap-2 overflow-x-auto whitespace-nowrap px-4 py-2 text-xs text-muted-foreground"
>
	<span>My Workspace</span>
	<ChevronRight class="h-3 w-3" />
	<span>Collections</span>
</div>

<Separator orientation="horizontal" />

<div class="inline-flex items-center gap-2">
	<Button size="sm" variant="text" on:click={handleNewCollection}>
		<Plus class="mr-2 h-4 w-4" />
		New
	</Button>
</div>

<Separator orientation="horizontal" />

<div class="flex flex-col p-2">
	{#if $restStore.length}
		<TreeCollection folders={$restStore} />
	{:else}
		<FeedbackCollectionEmpty />
	{/if}
</div>

<DialogEditCollection />
