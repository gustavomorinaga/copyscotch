<script lang="ts" context="module">
	import { page } from '$app/stores';
	import { getSettingsContext } from '$lib/contexts';
	import { Button } from '$lib/components/ui/button';
	import { screenStore } from '$lib/components/screen-watcher';
	import { Link2, Settings } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import { BREAKPOINTS } from '$lib/maps';

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
	const settingsContext = getSettingsContext();

	$: currentRoute = $page.route.id;
	$: isMobile = $screenStore.innerWidth < BREAKPOINTS.sm;
	$: orientation = (isMobile ? 'horizontal' : 'vertical') as 'horizontal' | 'vertical';
</script>

<nav class="flex h-full w-full flex-1 bg-background">
	<ul
		role="menubar"
		aria-orientation={orientation}
		class="group/sidenav-routes flex w-full flex-1 aria-[orientation=vertical]:w-full aria-[orientation=vertical]:flex-col"
	>
		{#each ROUTES as { title, path, icon }}
			{@const isCurrentRoute = currentRoute === path}

			<li role="none" class="flex group-aria-[orientation=horizontal]/sidenav-routes:flex-1">
				<Button
					size="icon"
					variant="ghost"
					href={path}
					role="menuitem"
					aria-current={isCurrentRoute ? 'page' : undefined}
					tabindex={isCurrentRoute ? 0 : -1}
					data-expanded={$settingsContext.navigation === 'expand'}
					class="relative h-14 w-14 flex-col text-muted-foreground after:pointer-events-none after:absolute after:inset-0 after:w-[2px] after:shrink-0 after:bg-transparent aria-[current=page]:bg-muted aria-[current=page]:text-accent-foreground aria-[current=page]:after:bg-primary aria-[current=page]:after:[view-transition-name:active-page] group-aria-[orientation=horizontal]/sidenav-routes:w-full group-aria-[orientation=horizontal]/sidenav-routes:after:top-auto group-aria-[orientation=horizontal]/sidenav-routes:after:h-[6px] group-aria-[orientation=horizontal]/sidenav-routes:after:w-full data-[expanded=true]:h-20 data-[expanded=true]:w-24 hover:bg-muted"
				>
					<svelte:component this={icon} class="h-5 w-5" />
					<span class="mt-2 text-xs" class:sr-only={$settingsContext.navigation === 'collapse'}>
						{title}
					</span>
				</Button>
			</li>
		{/each}
	</ul>
</nav>
