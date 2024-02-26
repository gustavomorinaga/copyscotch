<script lang="ts">
	import '$lib/styles/app.pcss';
	import { setSettingsContext } from '$lib/contexts';
	import { BREAKPOINTS } from '$lib/maps';
	import { Footer, Toolbar, Wrapper } from '$lib/layouts';
	import { SidenavRoutes } from '$lib/layouts/shared';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Sidenav from '$lib/components/ui/sidenav';
	import { ModeWatcher } from '$lib/components/mode-watcher';
	import { ScreenWatcher, screenStore } from '$lib/components/screen-watcher';
	import { ViewTransition } from '$lib/components/view-transition';
	import { executeParallel } from '$lib/utils';

	$: isMobile = $screenStore.innerWidth < BREAKPOINTS.sm;
</script>

<ModeWatcher />
<ScreenWatcher />
<ViewTransition />

<Wrapper class="overflow-hidden">
	<Toolbar />

	<main class="flex flex-auto flex-col">
		{#await executeParallel([setSettingsContext])}
			<Spinner />
		{:then}
			<Sidenav.Root
				orientation={isMobile ? 'vertical' : 'horizontal'}
				class="data-[orientation=vertical]:flex-col-reverse"
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
