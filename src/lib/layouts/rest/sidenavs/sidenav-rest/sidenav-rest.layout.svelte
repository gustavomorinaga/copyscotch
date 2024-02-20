<script lang="ts" context="module">
	import { Center } from '$lib/components/ui/center';
	import { Separator } from '$lib/components/ui/separator';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Folder, Loader, Layers, Clock } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	type TTab = {
		value: string;
		icon: typeof Folder;
		content: Promise<ComponentType>;
		disabled?: boolean;
	};
	type TAvailableTabs = (typeof LAZY_TABS)[number]['value'];

	const LAZY_TABS = [
		{
			value: 'collections',
			icon: Folder,
			content: import('$lib/layouts/rest/tabs/tab-collections').then((m) => m.TabCollections),
			disabled: false
		},
		{
			value: 'environments',
			icon: Layers,
			content: import('$lib/layouts/rest/feedbacks/feedback-collection-empty').then(
				(m) => m.FeedbackCollectionEmpty
			),
			disabled: true
		},
		{
			value: 'history',
			icon: Clock,
			content: import('$lib/layouts/rest/feedbacks/feedback-collection-empty').then(
				(m) => m.FeedbackCollectionEmpty
			),
			disabled: true
		}
	] as const satisfies Array<TTab>;
</script>

<script lang="ts">
	let currentTab: TAvailableTabs = 'collections';

	function handleCurrentTab(value: TAvailableTabs) {
		currentTab = value;
	}
</script>

<Tabs.Root value={currentTab} orientation="vertical" class="relative flex h-full flex-1 p-0">
	<Tabs.List class="gap-2 bg-background p-2">
		{#each LAZY_TABS as { value, icon, disabled }}
			<Tabs.Trigger
				{value}
				{disabled}
				class="p-2 data-[state=active]:text-primary"
				on:click={() => handleCurrentTab(value)}
			>
				<svelte:component this={icon} class="h-5 w-5" />
				<span class="sr-only capitalize">{value}</span>
			</Tabs.Trigger>
		{/each}
	</Tabs.List>

	<Separator orientation="vertical" />

	<div class="relative flex h-full w-full flex-1 flex-col overflow-y-auto bg-black/5">
		<div class="sticky top-0 z-10 inline-flex shrink-0 flex-col">
			<Breadcrumb.Root class="w-full select-none bg-background">
				<Breadcrumb.Item>My Workspace</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item current class="capitalize">{currentTab}</Breadcrumb.Item>
			</Breadcrumb.Root>
			<Separator orientation="horizontal" />
		</div>

		{#each LAZY_TABS as { value, content }}
			<Tabs.Content {value} class="m-0 w-full">
				{#await content}
					<Center>
						<Loader class="h-4 w-4 animate-spin" />
					</Center>
				{:then module}
					<svelte:component this={module} />
				{/await}
			</Tabs.Content>
		{/each}
	</div>
</Tabs.Root>
