<script lang="ts" context="module">
	import {
		DropdownMenuCollectionOptions,
		treeCollectionStore as treeStore,
		dialogEditCollectionStore,
		dialogEditRequestStore
	} from '$lib/layouts/rest';
	import { TreeExpand } from '../tree-expand';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Folder, FilePlus, FolderOpen, FolderPlus, MoreVertical } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import type { TFolderInfer } from '$lib/validators';

	type TFolderStatus = 'open' | 'closed';
	type TFolderOptions = {
		label: string;
		icon?: ComponentType;
		action: () => void;
	};

	const folderIcon = { open: FolderOpen, closed: Folder } as const;
	const folderOptions: Array<TFolderOptions> = [
		{
			label: 'New request',
			icon: FilePlus,
			action: () =>
				dialogEditRequestStore.set({
					mode: 'create',
					open: true,
					request: undefined
				})
		},
		{
			label: 'New folder',
			icon: FolderPlus,
			action: () =>
				dialogEditCollectionStore.set({
					mode: 'create',
					type: 'folder',
					open: true,
					collection: undefined
				})
		}
	] as const;
</script>

<script lang="ts">
	type $$Props = { folder: TFolderInfer; type: 'collection' | 'folder'; open?: boolean };

	export let folder: $$Props['folder'];
	export let type: $$Props['type'] = 'collection';
	export let open: $$Props['open'] = false;
	let openOptions: boolean = false;

	$: fileStatus = (open ? 'open' : 'closed') as TFolderStatus;
	$: if ($treeStore.collapse) open = false;

	function onOpenChange() {
		if ($treeStore.collapse) $treeStore.collapse = false;
	}
</script>

<Collapsible.Root class="flex flex-col" bind:open {onOpenChange}>
	<Collapsible.Trigger
		class={buttonVariants({ size: 'sm', variant: 'text', class: 'group/folder px-0' })}
	>
		<div
			role="button"
			tabindex="0"
			class="flex flex-1 items-center justify-center"
			on:contextmenu={(event) => {
				event.preventDefault();
				openOptions = true;
			}}
		>
			<svelte:component this={folderIcon[fileStatus]} class="mx-4 h-5 w-5" />
			<span class="flex flex-1 py-2 pr-2">
				<span class="truncate text-sm">{folder.name}</span>
			</span>
		</div>
		<div class="flex items-center gap-2">
			{#each folderOptions as option}
				<Button
					size="icon"
					variant="text"
					class="invisible h-6 w-6 group-hover/folder:visible"
					on:click={(event) => {
						event.stopPropagation();
						option.action();
					}}
				>
					<svelte:component this={option.icon} class="h-4 w-4" />
					<span class="sr-only">{option.label}</span>
				</Button>
			{/each}

			<DropdownMenuCollectionOptions collection={folder} {type} bind:open={openOptions} let:builder>
				<Button
					builders={[builder]}
					size="icon"
					variant="text"
					class="h-6 w-6"
					on:click={(event) => event.stopPropagation()}
				>
					<MoreVertical class="h-4 w-4" />
					<span class="sr-only">More options</span>
				</Button>
			</DropdownMenuCollectionOptions>
		</div>
	</Collapsible.Trigger>
	<Collapsible.Content class="flex">
		<TreeExpand bind:open />
		<slot />
	</Collapsible.Content>
</Collapsible.Root>
