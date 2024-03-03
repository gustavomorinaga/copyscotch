<script lang="ts" context="module">
	import { alertDialogCollectionDeletionStore as collectionDeletionDialogStore } from '$lib/layouts/rest/alert-dialogs/alert-dialog-collection-deletion';
	import { dialogEditCollectionStore as collectionDialogStore } from '$lib/layouts/rest/dialogs/dialog-edit-collection';
	import { dialogEditRequestStore as requestDialogStore } from '$lib/layouts/rest/dialogs/dialog-edit-request';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import Edit from 'lucide-svelte/icons/square-pen';
	import FilePlus from 'lucide-svelte/icons/file-plus';
	import FolderPlus from 'lucide-svelte/icons/folder-plus';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import type { ComponentType } from 'svelte';
	import type { TRESTCollectionInfer } from '$lib/validators';
	import type { TCollectionDialogStore } from '$lib/layouts/rest/dialogs/dialog-edit-collection';

	type TFolderMenuOption = {
		label: string;
		shortcut?: string;
		icon?: ComponentType;
		action: () => void;
	};
</script>

<script lang="ts">
	type $$Props = {
		collection: TRESTCollectionInfer;
		type: TCollectionDialogStore['type'];
		open?: boolean;
	};

	export let collection: $$Props['collection'];
	export let type: $$Props['type'] = 'collection';
	export let open: $$Props['open'] = false;

	const OPTIONS = [
		{
			label: 'New Request',
			shortcut: 'R',
			icon: FilePlus,
			action: () =>
				requestDialogStore.set({
					mode: 'create',
					open: true,
					collectionID: collection.id,
					request: undefined
				})
		},
		{
			label: 'New Folder',
			shortcut: 'F',
			icon: FolderPlus,
			action: () =>
				collectionDialogStore.set({
					mode: 'create',
					type: 'folder',
					open: true,
					parentID: collection.id,
					collection: undefined
				})
		},
		{
			label: 'Edit',
			shortcut: 'E',
			icon: Edit,
			action: () => collectionDialogStore.set({ mode: 'edit', type, open: true, collection })
		},
		{
			label: 'Delete',
			shortcut: 'D',
			icon: Trash2,
			action: () => collectionDeletionDialogStore.set({ open: true, collectionID: collection.id })
		}
	] satisfies Array<TFolderMenuOption>;
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger let:builder>
		<slot {builder} />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-64">
		{#each OPTIONS as option}
			<DropdownMenu.Item inset on:click={option.action}>
				<svelte:component this={option.icon} class="mr-2 h-4 w-4" />
				{option.label}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
