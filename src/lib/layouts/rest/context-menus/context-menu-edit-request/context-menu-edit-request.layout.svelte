<script lang="ts" context="module">
	import { onDestroy } from 'svelte';
	import { getRESTTabStore } from '$lib/stores';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { Copy, FileEdit, XCircle, XSquare } from 'lucide-svelte';
	import type { TRESTRequestInfer } from '$lib/validators';
	import type { ComponentType } from 'svelte';

	type TEditRequestCTXMenuOption = {
		label: string;
		shortcut?: string;
		icon?: ComponentType;
		action: () => void;
		showOnlyIf?: () => boolean;
	};
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTRequestInfer['id'] };

	export let tabID: $$Props['tabID'];
	let open = false;

	const restTabStore = getRESTTabStore();
	$: ({ tabs } = $restTabStore);

	$: hasOnlyOneTab = tabs.length === 1;
	$: open ? handleAddWindowEvents() : handleRemoveWindowEvents();

	const options = [
		{
			label: 'Rename Request',
			shortcut: 'R',
			icon: FileEdit,
			action: () => restTabStore.setEditing(tabID)
		},
		{
			label: 'Duplicate Tab',
			shortcut: 'D',
			icon: Copy,
			action: () => restTabStore.duplicate(tabID)
		},
		{
			label: 'Close Tab',
			shortcut: 'W',
			icon: XCircle,
			action: () => restTabStore.close(tabID)
		},
		{
			label: 'Close other Tabs',
			shortcut: 'X',
			icon: XSquare,
			action: () => restTabStore.closeOthers(tabID),
			showOnlyIf: () => !hasOnlyOneTab
		}
	] satisfies Array<TEditRequestCTXMenuOption>;

	const actionMap = options.reduce(
		(acc, option) => {
			acc[option.shortcut] = option.action;
			return acc;
		},
		{} as Record<string, TEditRequestCTXMenuOption['action']>
	) satisfies Record<string, TEditRequestCTXMenuOption['action']>;

	function handleKeypress(event: KeyboardEvent) {
		open = false;
		return actionMap[event.key.toUpperCase()]?.();
	}

	function handleAddWindowEvents() {
		window.addEventListener('keypress', handleKeypress);
	}

	function handleRemoveWindowEvents() {
		window.removeEventListener('keypress', handleKeypress);
	}

	onDestroy(() => {
		handleRemoveWindowEvents();
	});
</script>

<ContextMenu.Root bind:open>
	<ContextMenu.Trigger class="min-w-fit">
		<slot />
	</ContextMenu.Trigger>
	<ContextMenu.Content class="w-64">
		{#each options as option}
			{#if !option.showOnlyIf || option.showOnlyIf()}
				<ContextMenu.Item inset on:click={option.action}>
					{#if option.icon}
						<svelte:component this={option.icon} class="w-4 h-4 mr-2" />
					{/if}

					<span>{option.label}</span>

					{#if option.shortcut}
						<ContextMenu.Shortcut>
							<kbd>{option.shortcut}</kbd>
						</ContextMenu.Shortcut>
					{/if}
				</ContextMenu.Item>
			{/if}
		{/each}
	</ContextMenu.Content>
</ContextMenu.Root>
