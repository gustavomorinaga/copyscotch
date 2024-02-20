<script lang="ts" context="module">
	import {
		DropdownMenuCollectionOptions,
		treeSelectCollectionStore as treeStore,
		dialogEditCollectionStore,
		dialogEditRequestStore
	} from '$lib/layouts/rest';
	import { TreeExpand } from '../tree-expand';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Folder, FilePlus, FolderOpen, FolderPlus, MoreVertical } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import type { TFolderInfer } from '$lib/validators';

	type TFolderStatus = 'open' | 'closed';
	type TFolderOptions = {
		title: string;
		tooltip?: string;
		icon?: ComponentType;
		action: (folderID: TFolderInfer['id']) => void;
	};

	const ICONS = { open: FolderOpen, closed: Folder } as const;
	const OPTIONS: Array<TFolderOptions> = [
		{
			title: 'New request',
			tooltip: 'New Request',
			icon: FilePlus,
			action: (folderID) =>
				dialogEditRequestStore.set({
					mode: 'create',
					open: true,
					collectionID: folderID,
					request: undefined
				})
		},
		{
			title: 'New folder',
			tooltip: 'New Folder',
			icon: FolderPlus,
			action: (folderID) =>
				dialogEditCollectionStore.set({
					mode: 'create',
					type: 'folder',
					open: true,
					parentID: folderID,
					collection: undefined
				})
		}
	] as const;
</script>

<script lang="ts">
	type $$Props = {
		folder: TFolderInfer;
		type: 'collection' | 'folder';
		open?: boolean;
	};

	export let folder: $$Props['folder'];
	export let type: $$Props['type'] = 'collection';
	export let open: $$Props['open'] = false;
	let openOptions: boolean = false;

	$: status = (open ? 'open' : 'closed') as TFolderStatus;
	$: if ($treeStore.collapse) open = false;
	$: if ($treeStore.expand) open = true;

	function onOpenChange() {
		if ($treeStore.expand) $treeStore.expand = false;
		if ($treeStore.collapse) $treeStore.collapse = false;
	}
</script>

<Collapsible.Root class="flex shrink-0 flex-col" bind:open {onOpenChange}>
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
			<svelte:component this={ICONS[status]} class="mx-4 h-5 w-5" />
			<span class="flex flex-1 py-2 pr-2">
				<span class="truncate text-sm">{folder.name}</span>
			</span>
		</div>
		<div class="flex items-center gap-2">
			{#each OPTIONS as option}
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							size="icon"
							variant="text"
							class="invisible h-6 w-6 group-hover/folder:visible"
							on:click={(event) => {
								event.stopPropagation();
								option.action(folder.id);
							}}
						>
							<svelte:component this={option.icon} class="h-4 w-4" />
							<span class="sr-only">{option.title}</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="top" class="select-none">
						<span>{option.tooltip}</span>
					</Tooltip.Content>
				</Tooltip.Root>
			{/each}

			<DropdownMenuCollectionOptions
				collection={folder}
				{type}
				bind:open={openOptions}
				let:builder={dropdownBuilder}
			>
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder={tooltipBuilder}>
						<Button
							builders={[dropdownBuilder, tooltipBuilder]}
							size="icon"
							variant="text"
							class="h-6 w-6"
							on:click={(event) => event.stopPropagation()}
						>
							<MoreVertical class="h-4 w-4" />
							<span class="sr-only">More options</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="top" class="select-none">
						<span>More</span>
					</Tooltip.Content>
				</Tooltip.Root>
			</DropdownMenuCollectionOptions>
		</div>
	</Collapsible.Trigger>
	<Collapsible.Content class="flex">
		<TreeExpand bind:open />
		<slot />
	</Collapsible.Content>
</Collapsible.Root>
