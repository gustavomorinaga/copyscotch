<script lang="ts" context="module">
	import FolderDown from 'lucide-svelte/icons/folder-down';
	import Plus from 'lucide-svelte/icons/plus';
	import { dialogImportStore } from '$lib/features/rest/components/dialogs/dialog-import';
	import { dialogEditCollectionStore } from '$lib/features/rest/components/dialogs/dialog-edit-collection';
	import { Center } from '$lib/components/ui/center';
	import { Button } from '$lib/components/ui/button';
	import { mode } from '$lib/components/mode-watcher';
</script>

<script lang="ts">
	function handleImport() {
		dialogImportStore.set({ open: true });
	}

	function handleNewCollection() {
		dialogEditCollectionStore.set({
			mode: 'create',
			type: 'collection',
			open: true,
			collection: undefined
		});
	}
</script>

<div class="flex shrink-0 flex-col p-2">
	<Center class="p-2">
		<figure class="pointer-events-none mt-2 flex max-w-sm select-none flex-col items-center">
			<img
				src="/images/states/{$mode}/pack.svg"
				alt="Collections are empty"
				loading="lazy"
				class="inline-flex flex-col object-contain object-center"
				width="56"
				height="56"
			/>
			<figcaption
				class="mt-2 max-w-sm whitespace-normal text-center text-tiny text-muted-foreground"
			>
				Collections are empty
			</figcaption>
		</figure>

		<div class="mt-4 flex flex-col items-center space-y-4">
			<p class="select-none text-sm text-muted-foreground">Import or create a collection</p>
			<div class="flex flex-col items-stretch gap-4">
				<Button aria-label="Import Collection" class="w-40" on:click={handleImport}>
					<FolderDown class="mr-2 h-4 w-4 shrink-0" />
					<span class="select-none">Import</span>
				</Button>

				<Button
					size="sm"
					variant="secondary"
					aria-label="Add New Collection"
					class="w-40"
					on:click={handleNewCollection}
				>
					<Plus class="mr-2 h-4 w-4 shrink-0" />
					<span class="select-none">Add New</span>
				</Button>
			</div>
		</div>
	</Center>
</div>
