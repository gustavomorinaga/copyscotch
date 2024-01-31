<script lang="ts" context="module">
	import { dialogEditCollectionStore as dialogStore } from '$lib/layouts/rest';
	import { Center } from '$lib/components/ui/center';
	import { Button } from '$lib/components/ui/button';
	import { FolderDown, Plus } from 'lucide-svelte';
</script>

<script lang="ts">
	function handleNewCollection() {
		dialogStore.set({ mode: 'create', type: 'collection', open: true, collection: undefined });
	}
</script>

<div class="flex flex-col p-2">
	<Center>
		<p class="mt-2 max-w-sm whitespace-normal text-center text-tiny text-muted-foreground">
			Collections are empty
		</p>

		<div class="mt-4 flex flex-col items-center space-y-4">
			<p class="text-sm text-muted-foreground">Import or create a collection</p>
			<div class="flex flex-col items-stretch gap-4">
				<Button class="w-40" disabled>
					<FolderDown class="mr-2 h-4 w-4" />
					Import
				</Button>

				<Button size="sm" variant="secondary" class="w-40" on:click={handleNewCollection}>
					<Plus class="mr-2 h-4 w-4" />
					Add new
				</Button>
			</div>
		</div>
	</Center>
</div>
