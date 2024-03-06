<script lang="ts">
	import '$lib/styles/app.pcss';
	import { setSettingsContext } from '$lib/contexts';
	import { BREAKPOINTS } from '$lib/maps';
	import { executeParallel } from '$lib/utils';
	import { Toolbar } from '$lib/layouts/toolbar';
	import { Footer } from '$lib/layouts/footer';
	import { Wrapper } from '$lib/layouts/wrapper';
	import { SidenavRoutes } from '$lib/layouts/shared/sidenavs/sidenav-routes';
	import { ServiceWorker } from '$lib/components/service-worker';
	import { Metadata } from '$lib/components/metadata';
	import { ModeWatcher } from '$lib/components/mode-watcher';
	import { ScreenWatcher, screenStore } from '$lib/components/screen-watcher';
	import { ViewTransition } from '$lib/components/view-transition';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Sidenav from '$lib/components/ui/sidenav';

	$: isMobile = $screenStore.innerWidth < BREAKPOINTS.sm;
</script>

<ServiceWorker />
<Metadata />
<ModeWatcher />
<ScreenWatcher />
<ViewTransition />

<Wrapper class="overflow-hidden">
	<Toolbar />

	{#await executeParallel([setSettingsContext])}
		<Spinner />
	{:then}
		<main class="flex flex-auto flex-col">
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
		</main>

		<Footer />
	{/await}
</Wrapper>
