<script lang="ts" context="module">
	import { onDestroy } from 'svelte';
	import { getRESTStore } from '$lib/stores';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { Copy, FileEdit, XCircle, XSquare } from 'lucide-svelte';
	import type { TRESTRequestSchemaInfer } from '$lib/validators';
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
	type $$Props = { requestID: TRESTRequestSchemaInfer['id'] };

	export let requestID: $$Props['requestID'];
	let open = false;

	const restStore = getRESTStore();

	$: hasOnlyOneRequest = $restStore.requests.length === 1;
	$: open ? handleAddWindowEvents() : handleRemoveWindowEvents();

	const options = [
		{
			label: 'Rename Request',
			shortcut: 'R',
			icon: FileEdit,
			action: () => restStore.setEditRequest(requestID)
		},
		{
			label: 'Duplicate Tab',
			shortcut: 'D',
			icon: Copy,
			action: () => restStore.duplicateRequest(requestID)
		},
		{
			label: 'Close Tab',
			shortcut: 'W',
			icon: XCircle,
			action: () => restStore.closeRequest(requestID),
			showOnlyIf: () => !hasOnlyOneRequest
		},
		{
			label: 'Close other Tabs',
			shortcut: 'X',
			icon: XSquare,
			action: () => restStore.closeOtherRequests(requestID),
			showOnlyIf: () => !hasOnlyOneRequest
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
	<ContextMenu.Trigger on:contextmenu={() => restStore.setPredictedRequest(requestID)}>
		<slot />
	</ContextMenu.Trigger>
	<ContextMenu.Content class="w-64">
		{#each options as option}
			{#if !option.showOnlyIf || option.showOnlyIf()}
				<ContextMenu.Item on:click={option.action}>
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
