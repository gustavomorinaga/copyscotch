<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { getRESTTabContext } from '$lib/contexts';
	import { dialogEditRequestStore as dialogStore } from '$lib/layouts/rest/dialogs/dialog-edit-request';
	import { TabRequest } from '$lib/layouts/rest/tabs/tab-request';
	import { ContextMenuEditRequest } from '$lib/layouts/rest/context-menus/context-menu-edit-request';
	import { DialogSaveAs } from '$lib/layouts/rest/dialogs/dialog-save-as';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Tabs from '$lib/components/ui/tabs';
	import { horizontalScroll } from '$lib/directives';
	import Dot from 'lucide-svelte/icons/dot';
	import Plus from 'lucide-svelte/icons/plus';
	import X from 'lucide-svelte/icons/x';
	import type { TRESTTabInfer } from '$lib/validators';

	const LAZY_ALERT_DIALOG_COMPONENTS = [
		import('$lib/layouts/rest/alert-dialogs/alert-dialog-unsaved-changes')
	] as const;
</script>

<script lang="ts">
	const tabContext = getRESTTabContext();

	const tablistID = 'rest-tablist';
	let tablistRef: HTMLElement;
	let activeTabRef: HTMLElement;

	$: dirtyTabs = $tabContext.tabs.filter((tab) => tab.dirty);

	function handleCurrentTab(event: MouseEvent, tabID: TRESTTabInfer['id']) {
		event.stopPropagation();

		tabContext.setCurrentTab(tabID);
		scrollToActiveTab();
	}

	function handleCloseTab(event: MouseEvent | KeyboardEvent, tabID: TRESTTabInfer['id']) {
		event.stopPropagation();
		event.preventDefault();

		const isMouseEvent = event instanceof MouseEvent;
		const isKeyboardEvent = event instanceof KeyboardEvent && event.key === 'Enter';

		if (isMouseEvent || isKeyboardEvent) {
			const isDirty = tabContext.getTab(tabID)?.dirty;
			isDirty
				? tabContext.setTaintedTabs([tabID])
				: tabContext.closeTabs({ ids: [tabID], mode: 'normal' });
		}
	}

	function handleEditing(tabID: TRESTTabInfer['id']) {
		const { context: request } = tabContext.getTab(tabID) as TRESTTabInfer;
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

<Tabs.Root
	value={$tabContext.current}
	activateOnFocus={false}
	class="relative flex h-full w-full flex-1 flex-col"
>
	<Tabs.List
		id={tablistID}
		class="relative flex !h-auto min-h-12 touch-pan-x justify-start overflow-x-auto overflow-y-hidden scroll-smooth rounded-none p-0 pr-16 sm:overflow-x-hidden"
	>
		{#each $tabContext.tabs as tab}
			{@const tabID = tab.id}

			<ContextMenuEditRequest {tabID}>
				<div
					class="inline-flex"
					role="presentation"
					aria-hidden="true"
					on:dblclick={() => handleEditing(tabID)}
				>
					<Tabs.Trigger
						class="group/tab-trigger relative h-12 min-w-52 shrink-0 items-center justify-between gap-2 px-5 !shadow-none before:absolute before:inset-x-0 before:top-0 before:h-[.125rem] before:bg-transparent before:transition-colors data-[state=active]:before:bg-primary"
						aria-label="{tab.context.name} Tab"
						value={tabID}
						on:click={(event) => handleCurrentTab(event, tabID)}
					>
						<div
							class="my-auto inline-flex select-none items-baseline justify-center self-baseline"
						>
							<span
								class="block text-left text-tiny font-medium uppercase"
								style="color: hsl(var(--method-{tab.context.method.toLowerCase()}-color) / var(--tw-text-opacity))"
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
							<Tooltip.Root>
								<Tooltip.Trigger asChild let:builder>
									<Button
										builders={[builder]}
										size="icon"
										variant="text"
										role="button"
										tabindex={-1}
										aria-label={tab.dirty ? 'Close Tab - Unsaved Changes' : 'Close Tab'}
										class="relative h-6 w-6"
										on:click={(event) => handleCloseTab(event, tabID)}
										on:keydown={(event) => handleCloseTab(event, tabID)}
									>
										{#if tab.dirty}
											<Dot
												class="absolute inset-auto shrink-0 group-hover/tab-trigger:invisible"
												style="stroke-width: 5"
												aria-hidden="true"
												focusable="false"
											/>
										{/if}

										<X
											class="h-4 w-4 shrink-0 {tab.dirty &&
												'invisible group-hover/tab-trigger:visible'}"
										/>
										<span class="sr-only select-none">
											{tab.dirty ? 'Close Tab - Unsaved Changes' : 'Close Tab'}
										</span>
									</Button>
								</Tooltip.Trigger>
								<Tooltip.Content side="top" class="select-none">
									<span>Close</span>
								</Tooltip.Content>
							</Tooltip.Root>
						</div>
					</Tabs.Trigger>
				</div>
			</ContextMenuEditRequest>
		{/each}

		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					size="icon"
					variant="ghost"
					role="button"
					tabindex={0}
					aria-label="New Tab"
					class="mx-3 h-8 w-8 shrink-0"
					on:click={() => tabContext.addTab()}
				>
					<Plus class="h-4 w-4 shrink-0" />
					<span class="sr-only select-none">New Tab</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="top" class="select-none">
				<span>New</span>
			</Tooltip.Content>
		</Tooltip.Root>
	</Tabs.List>

	{#each $tabContext.tabs as tab}
		{@const tabID = tab.id}

		<Tabs.Content value={tabID} class="m-0 h-full overflow-y-auto bg-background">
			<TabRequest {tabID} />
		</Tabs.Content>
	{/each}
</Tabs.Root>

<DialogSaveAs />

{#if dirtyTabs.length}
	{#await Promise.all(LAZY_ALERT_DIALOG_COMPONENTS) then loadedComponents}
		{#each loadedComponents as component}
			<svelte:component this={component.default} />
		{/each}
	{/await}
{/if}
