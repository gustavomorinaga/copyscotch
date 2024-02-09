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
			class={`relative flex-col text-muted-foreground after:absolute after:inset-0 after:w-[2px] hover:bg-muted
				${isCurrentRoute ? 'bg-muted text-accent-foreground after:bg-primary' : 'after:bg-transparent'}
				${$settingsStore.navigation === 'expand' ? 'h-20 w-24' : 'h-14 w-14'}
			`}
		>
			<svelte:component this={icon} class="h-5 w-5" />
			<span class="mt-2 text-xs" class:sr-only={$settingsStore.navigation === 'collapse'}>
				{title}
			</span>
		</Button>
	{/each}
</div>
