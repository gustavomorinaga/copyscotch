<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { getRESTStore, getRESTTabStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import {
		TabRequest,
		ContextMenuEditRequest,
		DialogEditRequest,
		AlertDialogUnsavedChanges,
		dialogEditRequestStore as dialogStore
	} from '$lib/layouts/rest';
	import { horizontalScroll } from '$lib/directives';
	import { Dot, Plus, X } from 'lucide-svelte';
	import type { TRESTTabInfer } from '$lib/validators';
</script>

<script lang="ts">
	const restStore = getRESTStore();
	const tabStore = getRESTTabStore();

	const tablistID = 'rest-tablist';
	let tablistRef: HTMLElement;
	let activeTabRef: HTMLElement;

	function handleCurrentTab(event: MouseEvent, tabID: TRESTTabInfer['id']) {
		event.stopPropagation();
		tabStore.setCurrent(tabID);
		scrollToActiveTab();
	}

	function handleCloseTab(event: MouseEvent | KeyboardEvent, tabID: TRESTTabInfer['id']) {
		event.stopPropagation();
		event.preventDefault();

		const isMouseEvent = event instanceof MouseEvent;
		const isKeyboardEvent = event instanceof KeyboardEvent && event.key === 'Enter';

		if (isMouseEvent || isKeyboardEvent) {
			const isDirty = tabStore.get(tabID)?.dirty;
			isDirty ? tabStore.setTainted([tabID]) : tabStore.close({ ids: [tabID], mode: 'normal' });
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		const isMainTarget = event.target instanceof HTMLBodyElement;
		if (!isMainTarget) return;
		if (!$tabStore.current) return;

		if ((event.ctrlKey || event.metaKey) && event.key === 's') {
			event.preventDefault();
			const { context: request } = tabStore.get($tabStore.current) as TRESTTabInfer;
			restStore.saveRequests([request]);
			// tabStore.setDirty([$tabStore.current], false);
		}
	}

	function handleEditing(tabID: TRESTTabInfer['id']) {
		const { context: request } = tabStore.get(tabID) as TRESTTabInfer;
		dialogStore.set({ mode: 'edit', open: true, request });
	}

	function setTablistScroll() {
		tablistRef = document.getElementById(tablistID) as HTMLElement;
		horizontalScroll(tablistRef);
		scrollToActiveTab();
	}

	function scrollToActiveTab() {
		activeTabRef = tablistRef.querySelector('[data-state="active"]') as HTMLElement;
		activeTabRef.scrollIntoView({ inline: 'center', behavior: 'smooth' });
	}

	onMount(() => {
		setTablistScroll();
	});
</script>

<svelte:window on:keydown={handleKeyDown} />

<Tabs.Root
	value={$tabStore.current}
	activateOnFocus={false}
	class="relative flex h-full flex-1 flex-col"
>
	<Tabs.List
		id={tablistID}
		class="relative flex min-h-12 touch-pan-x justify-start overflow-x-auto overflow-y-hidden scroll-smooth rounded-none p-0 pr-16 sm:overflow-x-hidden"
	>
		{#each $tabStore.tabs as tab}
			{@const tabID = tab.id}
			{@const methodLowCase = tab.context.method.toLowerCase()}

			<ContextMenuEditRequest {tabID}>
				<div
					class="inline-flex"
					role="presentation"
					aria-hidden="true"
					on:dblclick={() => handleEditing(tabID)}
				>
					<Tabs.Trigger
						class="group/tab-trigger relative h-12 min-w-52 shrink-0 items-center justify-between gap-2 px-5 before:absolute before:inset-x-0 before:top-0 before:h-[.125rem] before:bg-transparent data-[state=active]:before:bg-primary"
						aria-label={tab.context.name}
						value={tabID}
						on:click={(event) => handleCurrentTab(event, tabID)}
					>
						<div
							class="my-auto inline-flex select-none items-baseline justify-center self-baseline"
						>
							<span
								class="block text-left text-tiny font-medium uppercase"
								style="color: var(--method-{methodLowCase}-color)"
							>
								{tab.context.method}
							</span>
						</div>

						<div
							class="my-auto inline-flex select-none items-baseline justify-center self-baseline"
						>
							<span class="block w-32 truncate text-left text-sm font-semibold">
								{tab.context.name}
							</span>
						</div>

						<div
							class="inline-flex select-none items-baseline justify-center group-hover/tab-trigger:visible"
							class:invisible={!tab.dirty}
						>
							<Button
								size="icon"
								variant="text"
								class="relative h-6 w-6"
								role="button"
								tabindex={-1}
								on:click={(event) => handleCloseTab(event, tabID)}
								on:keydown={(event) => handleCloseTab(event, tabID)}
							>
								{#if tab.dirty}
									<Dot
										class="absolute inset-auto group-hover/tab-trigger:invisible"
										style="stroke-width: 5"
										aria-hidden="true"
										focusable="false"
									/>
								{/if}

								<X class="h-4 w-4 {tab.dirty && 'invisible group-hover/tab-trigger:visible'}" />
								<span role="presentation" class="sr-only">
									{tab.dirty ? 'Unsaved Changes' : 'Close Tab'}
								</span>
							</Button>
						</div>
					</Tabs.Trigger>
				</div>
			</ContextMenuEditRequest>
		{/each}

		<Button
			size="icon"
			variant="ghost"
			class="mx-3 h-8 w-8 shrink-0"
			role="button"
			tabindex={0}
			aria-label="Add Request"
			on:click={() => tabStore.add()}
		>
			<Plus class="h-4 w-4" />
			<span role="presentation" class="sr-only">Add Request</span>
		</Button>
	</Tabs.List>

	{#each $tabStore.tabs as tab}
		{@const tabID = tab.id}

		<Tabs.Content value={tabID} class="m-0 bg-background p-4">
			<!-- <TabRequest {tabID} {form} /> -->
		</Tabs.Content>
	{/each}
</Tabs.Root>

<DialogEditRequest />
<AlertDialogUnsavedChanges />
