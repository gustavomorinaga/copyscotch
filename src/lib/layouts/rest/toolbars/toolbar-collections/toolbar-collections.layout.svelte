<script lang="ts" context="module">
	import {
		dialogEditCollectionStore as dialogStore,
		treeCollectionStore as treeStore
	} from '$lib/layouts/rest';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Plus, MinusSquare } from 'lucide-svelte';
</script>

<script lang="ts">
	function handleNewCollection() {
		dialogStore.set({ mode: 'create', type: 'collection', open: true, collection: undefined });
	}

	function handleCollapseAll() {
		$treeStore.collapse = true;
	}
</script>

<div class="inline-flex h-8 w-full flex-1 items-center justify-between">
	<div class="flex gap-2">
		<Button size="sm" variant="text" class="h-6" on:click={handleNewCollection}>
			<Plus class="mr-2 h-4 w-4" />
			New
		</Button>
	</div>

	<div class="flex gap-2">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					size="icon"
					variant="text"
					class="mx-2 h-6 w-6"
					on:click={handleCollapseAll}
				>
					<MinusSquare class="h-4 w-4" />
					<span class="sr-only">Collapse All</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="top" class="select-none">
				<span>Collapse All</span>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>
