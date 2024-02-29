<script lang="ts" context="module">
	import { Separator } from '$lib/components/ui/separator';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Tabs from '$lib/components/ui/tabs';
	import Folder from 'lucide-svelte/icons/folder';
	import Layers from 'lucide-svelte/icons/layers';
	import Clock from 'lucide-svelte/icons/clock';
	import type { TTab } from '$lib/ts';

	type TAvailableTabs = (typeof LAZY_TABS)[number]['value'];

	const LAZY_TABS = [
		{
			value: 'collections',
			label: 'Collections',
			icon: Folder,
			content: import('$lib/layouts/rest/tabs/tab-collections'),
			disabled: false
		},
		{
			value: 'environments',
			label: 'Environments',
			icon: Layers,
			content: import('$lib/layouts/rest/feedbacks/feedback-collection-empty'),
			disabled: true
		},
		{
			value: 'history',
			label: 'History',
			icon: Clock,
			content: import('$lib/layouts/rest/feedbacks/feedback-collection-empty'),
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
		{#each LAZY_TABS as { value, label, icon, disabled }}
			<Tabs.Trigger
				{value}
				{disabled}
				aria-label="{label} Tab"
				class="p-2 !shadow-none data-[state=active]:text-primary"
				on:click={() => handleCurrentTab(value)}
			>
				<svelte:component this={icon} class="h-5 w-5" />
				<span class="sr-only capitalize">{label}</span>
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

		{#each LAZY_TABS as { value, content }}
			<Tabs.Content {value} class="m-0 h-full w-full">
				{#await content}
					<Spinner />
				{:then module}
					<svelte:component this={module.default} />
				{/await}
			</Tabs.Content>
		{/each}
	</div>
</Tabs.Root>
