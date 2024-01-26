<script lang="ts" context="module">
	import { getRESTTabStore } from '$lib/stores';
	import { dialogEditRequestStore as dialogStore } from '$lib/layouts/rest';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Edit, MoreVertical, Trash2 } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import type { TRESTRequestInfer } from '$lib/validators';

	type TFileMenuOption = {
		label: string;
		shortcut?: string;
		icon?: ComponentType;
		action: () => void;
	};
</script>

<script lang="ts">
	type $$Props = { file: TRESTRequestInfer; openOptions?: boolean };

	export let file: $$Props['file'];
	export let openOptions: $$Props['openOptions'] = false;

	const tabStore = getRESTTabStore();

	const options = [
		{
			label: 'Edit',
			shortcut: 'E',
			icon: Edit,
			action: () => dialogStore.set({ mode: 'edit', open: true, request: file })
		},
		{
			label: 'Delete',
			shortcut: 'D',
			icon: Trash2,
			action: () => {}
		}
	] satisfies Array<TFileMenuOption>;
</script>

<Button
	size="sm"
	variant="text"
	class="w-full flex-1 px-0"
	on:click={(event) => {
		event.stopPropagation();
		tabStore.get(file.id) ? tabStore.setCurrent(file.id) : tabStore.add(file);
	}}
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
		<span
			class="pointer-events-none flex w-16 items-center justify-center truncate px-2 text-tiny"
			style="color: var(--method-{file.method.toLowerCase()}-color)"
		>
			{file.method}
		</span>
		<span class="flex flex-1 py-2 pr-2">
			<span class="truncate text-sm">{file.name}</span>
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
</Button>
