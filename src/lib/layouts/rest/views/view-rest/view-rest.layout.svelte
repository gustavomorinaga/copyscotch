<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { getRESTTabStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { ContextMenuEditRequest, DialogEditRequest, TabRequest } from '$lib/layouts';
	import { horizontalScroll } from '$lib/directives';
	import { Dot, Plus, X } from 'lucide-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { TRESTRequestSchema, TRESTTabInfer } from '$lib/validators';
</script>

<script lang="ts">
	import { DialogUnsavedChanges } from '$lib/layouts';

	type $$Props = { form: SuperValidated<TRESTRequestSchema> };

	export let form: $$Props['form'];

	const tabStore = getRESTTabStore();

	const tablistID = 'rest-tablist';
	let tablistRef: HTMLElement;
	let activeTabRef: HTMLElement;

	function handleCurrentTab(event: MouseEvent, id: TRESTTabInfer['id']) {
		event.stopPropagation();
		tabStore.setCurrent(id);
		scrollToActiveTab();
	}

	function handleCloseTab(event: MouseEvent | KeyboardEvent, id: TRESTTabInfer['id']) {
		event.stopPropagation();
		event.preventDefault();

		const isMouseEvent = event instanceof MouseEvent;
		const isKeyboardEvent = event instanceof KeyboardEvent && event.key === 'Enter';

		if (isMouseEvent || isKeyboardEvent) {
			if (tabStore.get(id)?.dirty) tabStore.setTainted(id);
			else tabStore.close(id);
		}
	}

	function handleEditing(id: TRESTTabInfer['id']) {
		tabStore.setEditing(id);
	}

	function setTablistScroll() {
		tablistRef = document.getElementById(tablistID) as HTMLElement;
		horizontalScroll(tablistRef);
		scrollToActiveTab();
	}

	function scrollToActiveTab() {
		activeTabRef = tablistRef.querySelector('[data-state="active"]') as HTMLElement;
		activeTabRef?.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
	}

	onMount(() => {
		setTablistScroll();
	});
</script>

<Tabs.Root value={$tabStore.current}>
	<Tabs.List
		id={tablistID}
		class="relative flex min-h-12 justify-start overflow-hidden scroll-smooth rounded-none p-0 pr-16"
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
						<div class="inline-flex select-none items-baseline justify-center">
							<span
								class="block text-left text-tiny font-medium uppercase"
								style="color: var(--method-{methodLowCase}-color)"
							>
								{tab.context.method}
							</span>
						</div>

						<div class="inline-flex select-none items-baseline justify-center">
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
								variant="ghost"
								class="h-5 w-5"
								role="button"
								tabindex={-1}
								aria-label="Close Tab"
								on:click={(event) => handleCloseTab(event, tabID)}
								on:keydown={(event) => handleCloseTab(event, tabID)}
							>
								{#if tab.dirty}
									<Dot class="h-4 w-4" style="stroke-width: 6" />
									<span role="presentation" class="sr-only">Unsaved Changes</span>
								{:else}
									<X class="h-4 w-4" />
									<span role="presentation" class="sr-only">Close Tab</span>
								{/if}
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
			on:click={tabStore.add}
		>
			<Plus class="h-4 w-4" />
			<span role="presentation" class="sr-only">Add Request</span>
		</Button>
	</Tabs.List>

	{#each $tabStore.tabs as tab}
		{@const tabID = tab.id}

		<Tabs.Content value={tabID} class="m-0 p-4">
			<TabRequest {tabID} {form} />
		</Tabs.Content>
	{/each}
</Tabs.Root>

<DialogEditRequest {form} />
<DialogUnsavedChanges />
