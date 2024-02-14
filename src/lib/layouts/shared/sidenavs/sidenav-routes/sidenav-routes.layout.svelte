<script lang="ts" context="module">
	import { page } from '$app/stores';
	import { getSettingsStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import { Link2, Settings } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	type TRoute = {
		title: string;
		path: string;
		icon: ComponentType;
	};

	const ROUTES = [
		{
			title: 'REST',
			path: '/',
			icon: Link2
		},
		{
			title: 'Settings',
			path: '/settings',
			icon: Settings
		}
	] as const satisfies Array<TRoute>;
</script>

<script lang="ts">
	const settingsStore = getSettingsStore();

	$: currentRoute = $page.route.id;
</script>

<div class="flex h-full flex-1 flex-col">
	{#each ROUTES as { title, path, icon }}
		{@const isCurrentRoute = currentRoute === path}

		<Button
			size="icon"
			variant="ghost"
			href={path}
			aria-current={isCurrentRoute ? 'page' : undefined}
			data-expanded={$settingsStore.navigation === 'expand'}
			class="relative h-14 w-14 flex-col text-muted-foreground after:absolute after:inset-0 after:w-[2px] after:bg-transparent aria-[current=page]:bg-muted aria-[current=page]:text-accent-foreground aria-[current=page]:after:bg-primary aria-[current=page]:after:[view-transition-name:active-page] data-[expanded=true]:h-20 data-[expanded=true]:w-24 hover:bg-muted"
		>
			<svelte:component this={icon} class="h-5 w-5" />
			<span class="mt-2 text-xs" class:sr-only={$settingsStore.navigation === 'collapse'}>
				{title}
			</span>
		</Button>
	{/each}
</div>
