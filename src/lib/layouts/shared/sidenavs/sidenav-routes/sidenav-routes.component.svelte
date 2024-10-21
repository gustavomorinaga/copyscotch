<script lang="ts" context="module">
	import type { ComponentType } from 'svelte';
	import Link2 from 'lucide-svelte/icons/link-2';
	import Settings from 'lucide-svelte/icons/settings';
	import { page } from '$app/stores';
	import { getSettingsContext } from '$lib/contexts/settings';
	import { BREAKPOINTS } from '$lib/constants/breakpoints';
	import { Button } from '$lib/components/ui/button';
	import { screenStore } from '$lib/components/screen-watcher';
	import * as Tooltip from '$lib/components/ui/tooltip';

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
		{#each ROUTES as route (route.path)}
			{@const isCurrentRoute = currentRoute === route.path}

			<li role="none" class="flex group-aria-[orientation=horizontal]/sidenav-routes:flex-1">
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<Button
							builders={[builder]}
							size="icon"
							variant="ghost"
							href={route.path}
							role="menuitem"
							tabindex={isCurrentRoute ? 0 : -1}
							data-expanded={$settingsContext.navigation === 'expand'}
							aria-label="{route.title} Page"
							aria-current={isCurrentRoute ? 'page' : undefined}
							class="relative h-14 w-14 flex-col text-muted-foreground after:pointer-events-none after:absolute after:inset-0 after:w-[2px] after:shrink-0 after:bg-transparent aria-[current=page]:bg-muted aria-[current=page]:text-accent-foreground aria-[current=page]:after:bg-primary aria-[current=page]:after:[view-transition-name:active-page] group-aria-[orientation=horizontal]/sidenav-routes:w-full group-aria-[orientation=horizontal]/sidenav-routes:after:top-auto group-aria-[orientation=horizontal]/sidenav-routes:after:h-[2px] group-aria-[orientation=horizontal]/sidenav-routes:after:w-full data-[expanded=true]:h-20 data-[expanded=true]:w-24 hover:bg-muted"
						>
							<svelte:component this={route.icon} class="h-5 w-5 shrink-0" />
							<span
								class="mt-2 select-none text-xs"
								class:sr-only={$settingsContext.navigation === 'collapse'}
							>
								{route.title}
							</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side={isMobile ? 'top' : 'right'} class="select-none">
						<span>{route.title}</span>
					</Tooltip.Content>
				</Tooltip.Root>
			</li>
		{/each}
	</ul>
</nav>
