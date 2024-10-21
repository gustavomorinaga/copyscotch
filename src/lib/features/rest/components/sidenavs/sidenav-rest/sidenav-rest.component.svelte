<script lang="ts" context="module">
	import Folder from 'lucide-svelte/icons/folder';
	import Layers from 'lucide-svelte/icons/layers';
	import Clock from 'lucide-svelte/icons/clock';
	import { Separator } from '$lib/components/ui/separator';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Tabs from '$lib/components/ui/tabs';
	import type { TTab } from '$lib/ts/types';

	const LAZY_TABS = [
		{
			value: 'collections',
			label: 'Collections',
			icon: Folder,
			content: import('$lib/features/rest/components/tabs/tab-collections').then(
				(module) => module.TabCollections
			),
			disabled: false
		},
		{
			value: 'environments',
			label: 'Environments',
			icon: Layers,
			content: import('$lib/features/rest/components/feedbacks/feedback-collection-empty').then(
				(module) => module.FeedbackCollectionEmpty
			),
			disabled: true
		},
		{
			value: 'history',
			label: 'History',
			icon: Clock,
			content: import('$lib/features/rest/components/feedbacks/feedback-collection-empty').then(
				(module) => module.FeedbackCollectionEmpty
			),
			disabled: true
		}
	] as const satisfies Array<TTab>;

	type TAvailableTabs = (typeof LAZY_TABS)[number]['value'];
</script>

<script lang="ts">
	let currentTab: TAvailableTabs = 'collections';

	function handleCurrentTab(value: TAvailableTabs) {
		currentTab = value;
	}
</script>

<Tabs.Root value={currentTab} orientation="vertical" class="relative flex h-full w-full flex-1 p-0">
	<Tabs.List class="gap-2 bg-background p-2">
		{#each LAZY_TABS as tab (tab.value)}
			<Tabs.Trigger
				value={tab.value}
				disabled={tab.disabled}
				aria-label="{tab.label} Tab"
				class="p-2 !shadow-none data-[state=active]:text-primary"
				on:click={() => handleCurrentTab(tab.value)}
			>
				<svelte:component this={tab.icon} class="h-5 w-5 shrink-0" />
				<span class="sr-only capitalize">{tab.label}</span>
			</Tabs.Trigger>
		{/each}
	</Tabs.List>

	<Separator orientation="vertical" />

	<div
		class="relative flex h-full w-full flex-1 flex-col overflow-y-auto bg-black bg-opacity-[0.025]"
	>
		<div class="sticky top-0 z-10 inline-flex shrink-0 flex-col">
			<Breadcrumb.Root class="w-full select-none bg-background">
				<Breadcrumb.Item>My Workspace</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item current class="capitalize">{currentTab}</Breadcrumb.Item>
			</Breadcrumb.Root>
			<Separator orientation="horizontal" />
		</div>

		{#each LAZY_TABS as tab (tab.value)}
			<Tabs.Content value={tab.value} class="m-0 h-full w-full">
				{#await tab.content}
					<Spinner />
				{:then module}
					<svelte:component this={module} />
				{/await}
			</Tabs.Content>
		{/each}
	</div>
</Tabs.Root>
