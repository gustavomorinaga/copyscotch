<script lang="ts" context="module">
	import type { ComponentType } from 'svelte';
	import CheckCircleBig from 'lucide-svelte/icons/circle-check-big';
	import Folder from 'lucide-svelte/icons/folder';
	import FolderOpen from 'lucide-svelte/icons/folder-open';
	import FolderPlus from 'lucide-svelte/icons/folder-plus';
	import FilePlus from 'lucide-svelte/icons/file-plus';
	import EllipsisVertical from 'lucide-svelte/icons/ellipsis-vertical';
	import {
		type TTreeSelectCollectionStore,
		treeSelectCollectionStore as treeStore
	} from '$lib/features/rest/components/trees/tree-select-collection/store';
	import { TreeExpand } from '$lib/features/rest/components/trees/tree-select-collection/tree-expand';
	import { debounce } from '$lib/utils/debounce';
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { DropdownMenuCollectionOptions } from '$lib/features/rest/components/dropdown-menus/dropdown-menu-collection-options';
	import { dialogEditCollectionStore } from '$lib/features/rest/components/dialogs/dialog-edit-collection';
	import { dialogEditRequestStore } from '$lib/features/rest/components/dialogs/dialog-edit-request';
	import type { TFolderInfer } from '$lib/schemas/collection';

	type TFolderStatus = 'open' | 'closed' | 'selected';
	type TFolderOptions = {
		title: string;
		tooltip?: string;
		icon?: ComponentType;
		action: (folderID: TFolderInfer['id']) => void;
	};

	const ICONS = {
		open: FolderOpen,
		closed: Folder,
		selected: CheckCircleBig
	} as const satisfies Record<TFolderStatus, ComponentType>;
	const OPTIONS: Array<TFolderOptions> = [
		{
			title: 'New Request',
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
			title: 'New Folder',
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
	};

	export let folder: $$Props['folder'];
	export let type: $$Props['type'] = 'collection';
	let openFolder: boolean = false;
	let openOptions: boolean = false;

	$: selected = $treeStore.selectedID === folder.id;
	$: if ($treeStore.collapse) {
		debounce(() => {
			const isCollection = type === 'collection';
			if (isCollection) openFolder = false;
		}, 0)();
	} else if ($treeStore.expand) {
		debounce(() => {
			openFolder = $treeStore.expandedFolders.includes(folder.id);
		}, 0)();
	} else {
		debounce(() => {
			openFolder = $treeStore.openedFolders.includes(folder.id);
		}, 0)();
	}
	$: status = (selected ? 'selected' : openFolder ? 'open' : 'closed') as TFolderStatus;

	function handleOpenChange(open: boolean) {
		if ($treeStore.collapse) $treeStore.collapse = false;

		const arrayField: keyof TTreeSelectCollectionStore = $treeStore.expand
			? 'expandedFolders'
			: 'openedFolders';

		$treeStore[arrayField] = open
			? Array.from(new Set([...$treeStore[arrayField], folder.id]))
			: $treeStore[arrayField].filter((id) => id !== folder.id);
	}

	function handleSelect() {
		if ($treeStore.selectedID === folder.id) {
			$treeStore.selectedID = undefined;
			$treeStore.selectedType = undefined;
			return;
		}

		$treeStore.selectedID = folder.id;
		$treeStore.selectedType = 'folder';
	}
</script>

<Collapsible.Root class="flex shrink-0 flex-col" open={openFolder} onOpenChange={handleOpenChange}>
	<Collapsible.Trigger asChild let:builder>
		<div class="group/folder flex flex-1 items-center gap-2">
			<Button
				builders={[builder]}
				size="sm"
				variant="text"
				role="treeitem"
				aria-label={folder.name}
				aria-selected={selected}
				aria-expanded={openFolder}
				tabindex={selected ? 0 : -1}
				class="flex flex-1 items-center justify-center px-0 aria-[selected=true]:text-success aria-[selected=true]:hover:text-success"
				on:click={handleSelect}
			>
				<div
					role="presentation"
					class="contents"
					on:contextmenu={(event) => {
						event.preventDefault();
						openOptions = true;
					}}
				>
					<svelte:component this={ICONS[status]} class="mx-4 h-5 w-5 shrink-0" />
					<span class="flex flex-1 py-2 pr-2">
						<span class="select-none truncate text-sm">{folder.name}</span>
					</span>
				</div>
			</Button>

			<div class="flex items-center gap-2">
				{#each OPTIONS as option}
					<Tooltip.Root>
						<Tooltip.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								size="icon"
								variant="text"
								aria-label={option.title}
								class="invisible h-6 w-6 group-hover/folder:visible"
								on:click={(event) => {
									event.stopPropagation();
									option.action(folder.id);
								}}
							>
								<svelte:component this={option.icon} class="h-4 w-4 shrink-0" />
								<span class="sr-only select-none">{option.title}</span>
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content side="top" class="select-none">
							<span>{option.tooltip}</span>
						</Tooltip.Content>
					</Tooltip.Root>
				{/each}

				<DropdownMenuCollectionOptions
					{type}
					collection={folder}
					bind:open={openOptions}
					let:builder={dropdownBuilder}
				>
					<Tooltip.Root>
						<Tooltip.Trigger asChild let:builder={tooltipBuilder}>
							<Button
								builders={[dropdownBuilder, tooltipBuilder]}
								size="icon"
								variant="text"
								aria-label="More Options"
								class="h-6 w-6"
								on:click={(event) => event.stopPropagation()}
							>
								<EllipsisVertical class="h-4 w-4 shrink-0" />
								<span class="sr-only select-none">More Options</span>
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content side="top" class="select-none">
							<span>More</span>
						</Tooltip.Content>
					</Tooltip.Root>
				</DropdownMenuCollectionOptions>
			</div>
		</div>
	</Collapsible.Trigger>
	<Collapsible.Content class="flex">
		<TreeExpand onOpenChange={handleOpenChange} />
		<slot />
	</Collapsible.Content>
</Collapsible.Root>
