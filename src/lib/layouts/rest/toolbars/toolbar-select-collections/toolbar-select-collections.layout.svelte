<script lang="ts" context="module">
	import { getRESTContext } from '$lib/contexts';
	import { dialogImportStore } from '$lib/layouts/rest/dialogs/dialog-import';
	import { dialogEditCollectionStore } from '$lib/layouts/rest/dialogs/dialog-edit-collection';
	import { treeSelectCollectionStore as treeStore } from '$lib/layouts/rest/trees/tree-select-collection';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import FolderDown from 'lucide-svelte/icons/folder-down';
	import Plus from 'lucide-svelte/icons/plus';
	import MinusSquare from 'lucide-svelte/icons/minus-square';
</script>

<script lang="ts">
	const restContext = getRESTContext();

	function handleNewCollection() {
		dialogEditCollectionStore.set({
			mode: 'create',
			type: 'collection',
			open: true,
			collection: undefined
		});
	}

	function handleImportExport() {
		dialogImportStore.set({ open: true });
	}

	function handleCollapseAll() {
		$treeStore.collapse = true;
	}
</script>

<div class="inline-flex h-[2.250rem] w-full flex-1 items-center justify-between bg-background">
	<div class="flex">
		<Button
			size="sm"
			variant="text"
			aria-label="New Collection"
			class="h-[2.250rem]"
			on:click={handleNewCollection}
		>
			<Plus class="mr-2 h-4 w-4 shrink-0" />
			<span class="select-none">New</span>
		</Button>
	</div>

	<div class="flex">
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					size="icon"
					variant="text"
					aria-label="Import / Export"
					class="mx-2 h-[2.250rem] w-6"
					on:click={handleImportExport}
				>
					<FolderDown class="h-4 w-4 shrink-0" />
					<span class="sr-only select-none">Import / Export</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="top" class="select-none">
				<span>Import / Export</span>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					size="icon"
					variant="text"
					aria-label="Collapse All"
					class="mx-2 h-[2.250rem] w-6"
					disabled={!$restContext.length}
					on:click={handleCollapseAll}
				>
					<MinusSquare class="h-4 w-4 shrink-0" />
					<span class="sr-only select-none">Collapse All</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="top" class="select-none">
				<span>Collapse All</span>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>
