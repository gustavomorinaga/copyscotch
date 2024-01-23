<script lang="ts" context="module">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Folder, FolderOpen, MoreVertical, Trash2 } from 'lucide-svelte';
	import { TreeExpand } from '$lib/layouts';
	import type { TFolderInfer } from '$lib/validators';

	type TFolderStatus = 'open' | 'closed';

	const folderIcon = { open: FolderOpen, closed: Folder } as const;
</script>

<script lang="ts">
	type $$Props = { folder: TFolderInfer; open?: boolean };

	export let folder: $$Props['folder'];
	export let open = false;

	$: fileStatus = (open ? 'open' : 'closed') as TFolderStatus;
</script>

<Collapsible.Root class="flex flex-col" bind:open>
	<Collapsible.Trigger class={buttonVariants({ size: 'sm', variant: 'text', class: 'px-0' })}>
		<div class="flex flex-1 items-center justify-center">
			<svelte:component this={folderIcon[fileStatus]} class="mx-4 h-5 w-5" />
			<span class="flex flex-1 py-2 pr-2">
				<span class="truncate text-sm">{folder.name}</span>
			</span>
		</div>
		<div class="flex items-center">
			<DropdownMenu.Root>
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
				<DropdownMenu.Content>
					<DropdownMenu.Item>
						<Trash2 class="mr-2 h-4 w-4" />
						Delete
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</Collapsible.Trigger>
	<Collapsible.Content class="flex">
		<TreeExpand bind:open />
		<slot />
	</Collapsible.Content>
</Collapsible.Root>
