<script lang="ts" context="module">
	import { dialogEditCollectionStore as dialogStore } from '$lib/layouts/rest';
	import { Center } from '$lib/components/ui/center';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import type { TFolderInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { folder: TFolderInfer };

	export let folder: $$Props['folder'];

	function handleNewFolder() {
		dialogStore.set({
			mode: 'create',
			type: 'folder',
			open: true,
			parentID: folder.id,
			collection: undefined
		});
	}
</script>

<div class="flex flex-col p-2">
	<Center>
		<p
			class="mt-2 max-w-sm select-none whitespace-normal text-center text-tiny text-muted-foreground"
		>
			Folder are empty
		</p>

		<div class="mt-4 flex flex-col items-center space-y-4">
			<div class="flex flex-col items-stretch gap-4">
				<Button size="sm" variant="secondary" class="w-40" on:click={handleNewFolder}>
					<Plus class="mr-2 h-4 w-4" />
					Add new
				</Button>
			</div>
		</div>
	</Center>
</div>
