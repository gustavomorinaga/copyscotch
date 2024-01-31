<script lang="ts" context="module">
	import { dialogEditRequestStore as dialogStore } from '$lib/layouts/rest';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Edit, Trash2 } from 'lucide-svelte';
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
	type $$Props = { request: TRESTRequestInfer; open?: boolean };

	export let request: $$Props['request'];
	export let open: $$Props['open'] = false;

	const OPTIONS = [
		{
			label: 'Edit',
			shortcut: 'E',
			icon: Edit,
			action: () => dialogStore.set({ mode: 'edit', open: true, request })
		},
		{
			label: 'Delete',
			shortcut: 'D',
			icon: Trash2,
			action: () => {}
		}
	] satisfies Array<TFileMenuOption>;
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
