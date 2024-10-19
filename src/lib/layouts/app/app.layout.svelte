<script lang="ts" context="module">
	import '$lib/styles/app.pcss';
	import { setSettingsContext } from '$lib/contexts/settings';
	import { BREAKPOINTS } from '$lib/constants/breakpoints';
	import { executeParallel } from '$lib/utils/parallel';
	import { Toolbar } from '$lib/layouts/shared/toolbar';
	import { Footer } from '$lib/layouts/shared/footer';
	import { Wrapper } from '$lib/layouts/shared/wrapper';
	import { SidenavRoutes } from '$lib/layouts/shared/sidenavs/sidenav-routes';
	import { screenStore } from '$lib/components/screen-watcher';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Sidenav from '$lib/components/ui/sidenav';
</script>

<script lang="ts">
	$: isMobile = $screenStore.innerWidth < BREAKPOINTS.sm;
</script>

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
