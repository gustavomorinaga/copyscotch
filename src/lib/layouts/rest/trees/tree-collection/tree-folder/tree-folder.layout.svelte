<script lang="ts" context="module">
	import { dialogEditCollectionStore as dialogStore } from '$lib/layouts/rest';
	import { TreeExpand } from '../tree-expand';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Edit, Folder, FolderOpen, MoreVertical, Trash2 } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import type { TFolderInfer } from '$lib/validators';

	type TFolderStatus = 'open' | 'closed';
	type TFolderMenuOption = {
		label: string;
		shortcut?: string;
		icon?: ComponentType;
		action: () => void;
	};

	const folderIcon = { open: FolderOpen, closed: Folder } as const;
</script>

<script lang="ts">
	type $$Props = { folder: TFolderInfer; open?: boolean; openOptions?: boolean };

	export let folder: $$Props['folder'];
	export let open: $$Props['open'] = false;
	export let openOptions: $$Props['openOptions'] = false;

	const options = [
		{
			label: 'Edit',
			shortcut: 'E',
			icon: Edit,
			action: () => dialogStore.set({ mode: 'edit', open: true, collection: folder })
		},
		{
			label: 'Delete',
			shortcut: 'D',
			icon: Trash2,
			action: () => {}
		}
	] satisfies Array<TFolderMenuOption>;

	$: fileStatus = (open ? 'open' : 'closed') as TFolderStatus;
</script>

<Collapsible.Root class="flex flex-col" bind:open>
	<Collapsible.Trigger class={buttonVariants({ size: 'sm', variant: 'text', class: 'px-0' })}>
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
		<div class="flex items-center">
			<DropdownMenu.Root bind:open={openOptions}>
				<DropdownMenu.Trigger let:builder>
					<Button
						builders={[builder]}
						size="icon"
						variant="ghost"
						class="h-6 w-6 text-accent-foreground"
						on:click={(event) => event.stopPropagation()}
					>
						<MoreVertical class="h-4 w-4" />
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-64">
					{#each options as option}
						<DropdownMenu.Item inset on:click={option.action}>
							<svelte:component this={option.icon} class="mr-2 h-4 w-4" />
							{option.label}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</Collapsible.Trigger>
	<Collapsible.Content class="flex">
		<TreeExpand bind:open />
		<slot />
	</Collapsible.Content>
</Collapsible.Root>
