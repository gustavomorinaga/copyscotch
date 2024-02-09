<script lang="ts" context="module">
	import { page } from '$app/stores';
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
	$: currentRoute = $page.route.id;
</script>

<div class="flex h-full flex-col">
	{#each ROUTES as { title, path, icon }}
		{@const isCurrentRoute = currentRoute === path}

		<Button
			size="icon"
			variant="ghost"
			href={path}
			class="relative h-14 w-14 text-muted-foreground after:absolute after:inset-0 after:w-[2px] hover:bg-muted {isCurrentRoute
				? 'bg-muted text-accent-foreground after:bg-primary'
				: 'after:bg-transparent'}"
		>
			<svelte:component this={icon} class="h-5 w-5" />
			<span class="sr-only">{title}</span>
		</Button>
	{/each}
</div>
