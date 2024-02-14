<script lang="ts" context="module">
	import { onDestroy } from 'svelte';
	import { getRESTTabStore } from '$lib/stores';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { ShortcutKey } from '$lib/components/ui/shortcut';
	import { dialogEditRequestStore as dialogStore } from '$lib/layouts/rest';
	import { Copy, FileEdit, XCircle, XOctagon, XSquare } from 'lucide-svelte';
	import type { TRESTRequestInfer, TRESTTabInfer } from '$lib/validators';
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

	const tabStore = getRESTTabStore();

	$: hasOnlyOneTab = $tabStore.tabs.length === 1;
	$: open ? handleAddWindowEvents() : handleRemoveWindowEvents();

	const OPTIONS = [
		{
			label: 'Rename',
			shortcut: 'R',
			icon: FileEdit,
			action: () => {
				const { context: request } = tabStore.get(tabID) as TRESTTabInfer;
				dialogStore.set({ mode: 'edit', open: true, request });
			}
		},
		{
			label: 'Duplicate',
			shortcut: 'D',
			icon: Copy,
			action: () => tabStore.duplicate(tabID)
		},
		{
			label: 'Close',
			shortcut: 'W',
			icon: XCircle,
			action: () => {
				if (tabStore.get(tabID)?.dirty) tabStore.setTainted([tabID]);
				else tabStore.close({ ids: [tabID], mode: 'normal' });
			}
		},
		{
			label: 'Close Others',
			shortcut: 'X',
			icon: XSquare,
			action: () => {
				const otherTabs = $tabStore.tabs.filter((tab) => tab.id !== tabID);
				const dirtyTabs = otherTabs.filter((tab) => tab.dirty);
				if (dirtyTabs.length) tabStore.setTainted(otherTabs.map((tab) => tab.id));
				else tabStore.close({ ids: [tabID], mode: 'close-others' });
			},
			showOnlyIf: () => !hasOnlyOneTab
		},
		{
			label: 'Close All',
			shortcut: 'X',
			icon: XOctagon,
			action: () => {
				const dirtyTabs = $tabStore.tabs.filter((tab) => tab.dirty);
				if (dirtyTabs.length) tabStore.setTainted($tabStore.tabs.map((tab) => tab.id));
				else tabStore.close({ ids: [], mode: 'close-all' });
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
						<svelte:component this={option.icon} class="mr-2 h-4 w-4" />
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
