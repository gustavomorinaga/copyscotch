<script lang="ts" context="module">
	import { onDestroy } from 'svelte';
	import Copy from 'lucide-svelte/icons/copy';
	import FilePen from 'lucide-svelte/icons/file-pen';
	import CircleX from 'lucide-svelte/icons/circle-x';
	import OctagonX from 'lucide-svelte/icons/octagon-x';
	import SquareX from 'lucide-svelte/icons/square-x';
	import type { ComponentType } from 'svelte';
	import type { TRESTRequestInfer, TRESTTabInfer } from '$lib/validators';
	import { dialogEditRequestStore as dialogStore } from '$lib/layouts/rest/dialogs/dialog-edit-request';
	import { ShortcutKey } from '$lib/components/ui/shortcut';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { getRESTTabContext } from '$lib/contexts/rest';

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

	const tabContext = getRESTTabContext();

	$: hasOnlyOneTab = $tabContext.tabs.length === 1;
	$: open ? handleAddWindowEvents() : handleRemoveWindowEvents();

	const OPTIONS = [
		{
			label: 'Rename',
			shortcut: 'R',
			icon: FilePen,
			action: () => {
				const { context: request } = tabContext.getTab(tabID) as TRESTTabInfer;
				dialogStore.set({ mode: 'edit', open: true, request });
			}
		},
		{
			label: 'Duplicate',
			shortcut: 'D',
			icon: Copy,
			action: () => tabContext.duplicateTab(tabID)
		},
		{
			label: 'Close',
			shortcut: 'W',
			icon: CircleX,
			action: () => {
				if (tabContext.getTab(tabID)?.dirty) tabContext.setTaintedTabs([tabID]);
				else tabContext.closeTabs({ ids: [tabID], mode: 'normal' });
			}
		},
		{
			label: 'Close Others',
			shortcut: 'X',
			icon: SquareX,
			action: () => {
				const otherTabs = $tabContext.tabs.filter((tab) => tab.id !== tabID);
				const dirtyTabs = otherTabs.filter((tab) => tab.dirty);
				if (dirtyTabs.length) tabContext.setTaintedTabs(otherTabs.map((tab) => tab.id));
				else tabContext.closeTabs({ ids: [tabID], mode: 'close-others' });
			},
			showOnlyIf: () => !hasOnlyOneTab
		},
		{
			label: 'Close All',
			shortcut: 'A',
			icon: OctagonX,
			action: () => {
				const dirtyTabs = $tabContext.tabs.filter((tab) => tab.dirty);
				if (dirtyTabs.length) tabContext.setTaintedTabs($tabContext.tabs.map((tab) => tab.id));
				else tabContext.closeTabs({ ids: [], mode: 'close-all' });
			},
			showOnlyIf: () => !hasOnlyOneTab
		}
	] satisfies Array<TEditRequestCTXMenuOption>;

	const ACTIONS = OPTIONS.reduce(
		(acc, option) => {
			acc[option.shortcut] = option.action;
			return acc;
		},
		{} as Record<string, TEditRequestCTXMenuOption['action']>
	) satisfies Record<string, TEditRequestCTXMenuOption['action']>;

	function handleKeydown(event: KeyboardEvent) {
		open = false;
		return ACTIONS[event.key.toUpperCase()]?.();
	}

	function handleAddWindowEvents() {
		document.addEventListener('keydown', handleKeydown);
	}

	function handleRemoveWindowEvents() {
		document.removeEventListener('keydown', handleKeydown);
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
		{#each OPTIONS as option}
			{#if !option.showOnlyIf || option.showOnlyIf()}
				<ContextMenu.Item inset on:click={option.action}>
					{#if option.icon}
						<svelte:component this={option.icon} class="mr-2 h-4 w-4 shrink-0" />
					{/if}

					<span>{option.label}</span>

					{#if option.shortcut}
						<ContextMenu.Shortcut>
							<ShortcutKey>{option.shortcut}</ShortcutKey>
						</ContextMenu.Shortcut>
					{/if}
				</ContextMenu.Item>
			{/if}
		{/each}
	</ContextMenu.Content>
</ContextMenu.Root>
