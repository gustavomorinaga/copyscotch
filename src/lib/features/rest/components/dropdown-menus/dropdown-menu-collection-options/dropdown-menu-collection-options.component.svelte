<script lang="ts" module>
	import Edit from 'lucide-svelte/icons/square-pen';
	import FilePlus from 'lucide-svelte/icons/file-plus';
	import FolderPlus from 'lucide-svelte/icons/folder-plus';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import type { ComponentType } from 'svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { dialogEditRequestStore as requestDialogStore } from '$lib/features/rest/components/dialogs/dialog-edit-request';
	import { dialogEditCollectionStore as collectionDialogStore } from '$lib/features/rest/components/dialogs/dialog-edit-collection';
	import { alertDialogCollectionDeletionStore as collectionDeletionDialogStore } from '$lib/features/rest/components/alert-dialogs/alert-dialog-collection-deletion';
	import type { TRESTCollectionInfer } from '$lib/schemas/collection';
	import type { TCollectionDialogStore } from '$lib/features/rest/components/dialogs/dialog-edit-collection';

	type TFolderMenuOption = {
		label: string;
		shortcut?: string;
		icon?: ComponentType;
		action: () => void;
	};
</script>

<script lang="ts">
	

	interface Props {
		collection: TRESTCollectionInfer;
		type: TCollectionDialogStore['type'];
		open?: boolean;
		children?: import('svelte').Snippet<[any]>;
	}

	let {
		collection,
		type = 'collection',
		open = $bindable(false),
		children
	}: Props = $props();

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
	<DropdownMenu.Trigger >
		{#snippet children({ builder })}
				{@render children?.({ builder, })}
					{/snippet}
		</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-64">
		{#each OPTIONS as option}
			<DropdownMenu.Item inset on:click={option.action}>
				<option.icon class="mr-2 h-4 w-4 shrink-0" />
				{option.label}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
