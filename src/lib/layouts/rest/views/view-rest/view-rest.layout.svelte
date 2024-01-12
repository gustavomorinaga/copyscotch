<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { getRESTTabStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { ContextMenuEditRequest, DialogEditRequest, TabRequest } from '$lib/layouts';
	import { horizontalScroll } from '$lib/directives';
	import { Plus, X } from 'lucide-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { TRESTRequestSchema, TRESTRequestInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { form: SuperValidated<TRESTRequestSchema> };

	export let form: $$Props['form'];

	const tabStore = getRESTTabStore();

	const tablistID = 'rest-tablist';
	let tablistRef: HTMLElement;
	let activeTabRef: HTMLElement;

	function handleCurrentTab(event: MouseEvent, id: TRESTRequestInfer['id']) {
		event.stopPropagation();
		tabStore.setCurrent(id);
		scrollToActiveTab();
	}

	function handleCloseTab(event: MouseEvent | KeyboardEvent, id: TRESTRequestInfer['id']) {
		event.stopPropagation();
		event.preventDefault();

		const isMouseEvent = event instanceof MouseEvent;
		const isKeyboardEvent = event instanceof KeyboardEvent && event.key === 'Enter';

		if (isMouseEvent || isKeyboardEvent) tabStore.close(id);
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
		class="relative flex justify-start rounded-none min-h-12 p-0 pr-16 overflow-hidden scroll-smooth"
	>
		{#each $tabStore.tabs as tab}
			{@const tabID = tab.id}
			{@const methodLowCase = tab.context.method.toLowerCase()}

			<ContextMenuEditRequest {tabID}>
				<Tabs.Trigger
					class="relative justify-between shrink-0 gap-2 min-w-52 h-12 px-5 group/tab-trigger before:absolute before:top-0 before:inset-x-0 before:h-[.125rem] data-[state=active]:before:bg-primary before:bg-transparent"
					aria-label={tab.context.name}
					value={tabID}
					on:click={(event) => handleCurrentTab(event, tabID)}
				>
					<DialogEditRequest {tabID} {form}>
						<div class="tab-trigger-prefix">
							<span class="method" style="color: var(--method-{methodLowCase}-color)">
								{tab.context.method}
							</span>
						</div>

						<div class="tab-trigger-content">
							<span class="name">{tab.context.name}</span>
						</div>
					</DialogEditRequest>

					<div class="tab-trigger-suffix invisible group-hover/tab-trigger:visible">
						<Button
							size="icon"
							variant="ghost"
							class="w-5 h-5"
							role="button"
							tabindex={-1}
							aria-label="Close Tab"
							on:click={(event) => handleCloseTab(event, tabID)}
							on:keydown={(event) => handleCloseTab(event, tabID)}
						>
							<X class="w-4 h-4" />
							<span role="presentation" class="sr-only">Close Tab</span>
						</Button>
					</div>
				</Tabs.Trigger>
			</ContextMenuEditRequest>
		{/each}

		<Button
			size="icon"
			variant="ghost"
			class="w-8 h-8 mx-3 shrink-0"
			role="button"
			tabindex={0}
			aria-label="Add Request"
			on:click={tabStore.add}
		>
			<Plus class="w-4 h-4" />
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

<style lang="postcss">
	div.tab-trigger-prefix {
		@apply mr-2 inline-flex items-center justify-center;

		& > span.method {
			@apply block text-xs font-medium uppercase;
		}
	}

	div.tab-trigger-content {
		@apply inline-flex items-baseline justify-center;

		& > span.name {
			@apply block w-32 truncate text-left text-sm font-semibold;
		}
	}

	div.tab-trigger-suffix {
		@apply inline-flex items-center justify-center;
	}
</style>
