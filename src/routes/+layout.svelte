<script lang="ts">
	import '$lib/styles/app.pcss';
	import { setSettingsContext } from '$lib/contexts';
	import { BREAKPOINTS } from '$lib/maps';
	import { Footer, Toolbar, Wrapper } from '$lib/layouts';
	import { SidenavRoutes } from '$lib/layouts/shared';
	import { Center } from '$lib/components/ui/center';
	import * as Sidenav from '$lib/components/ui/sidenav';
	import { ModeWatcher } from '$lib/components/mode-watcher';
	import { ScreenWatcher, screenStore } from '$lib/components/screen-watcher';
	import { ViewTransition } from '$lib/components/view-transition';
	import { executeParallel } from '$lib/utils';
	import { Loader } from 'lucide-svelte';

	$: isMobile = $screenStore.innerWidth < BREAKPOINTS.sm;
</script>

<ModeWatcher />
<ScreenWatcher />
<ViewTransition />

<Wrapper class="overflow-hidden">
	<Toolbar />

	<main class="flex flex-auto flex-col">
		{#await executeParallel([setSettingsContext])}
			<Center>
				<Loader class="h-4 w-4 animate-spin" />
			</Center>
		{:then}
			<Sidenav.Root
				orientation={isMobile ? 'vertical' : 'horizontal'}
				class="aria-[orientation=vertical]:flex-col-reverse"
			>
				<Sidenav.Nav class="overflow-hidden {isMobile ? 'h-fit w-full' : 'h-full'}">
					<SidenavRoutes />
				</Sidenav.Nav>
				<Sidenav.Separator orientation={isMobile ? 'horizontal' : 'vertical'} />
				<Sidenav.Content class="[view-transition-name:content]">
					<slot />
				</Sidenav.Content>
			</Sidenav.Root>
		{/await}
	</main>

	<Footer />
</Wrapper>
