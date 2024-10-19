<script lang="ts">
	import '$lib/styles/app.pcss';
	import { siteConfig as config } from '$lib/configs/site';
	import { setSettingsContext } from '$lib/contexts/settings';
	import { BREAKPOINTS } from '$lib/constants/breakpoints';
	import { executeParallel } from '$lib/utils/parallel';
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
	import { Toaster } from '$lib/components/ui/sonner';
	import * as Sidenav from '$lib/components/ui/sidenav';

	$: isMobile = $screenStore.innerWidth < BREAKPOINTS.sm;
</script>

<ServiceWorker />
<Metadata {config} />
<ModeWatcher />
<ScreenWatcher />
<ViewTransition />

<Toaster position="bottom-center" offset={40} />

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
