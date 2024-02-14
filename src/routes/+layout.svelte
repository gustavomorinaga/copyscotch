<script lang="ts">
	import '$lib/styles/app.pcss';
	import { setSettingsStore } from '$lib/stores';
	import { Footer, Toolbar, Wrapper } from '$lib/layouts';
	import { SidenavRoutes } from '$lib/layouts/shared';
	import { Center } from '$lib/components/ui/center';
	import * as Sidenav from '$lib/components/ui/sidenav';
	import { ModeWatcher } from '$lib/components/mode-watcher';
	import { executeParallel } from '$lib/utils';
	import { Loader } from 'lucide-svelte';
</script>

<ModeWatcher />

<Wrapper class="overflow-hidden">
	<Toolbar />

	<main class="flex flex-auto flex-col">
		{#await executeParallel([setSettingsStore])}
			<Center>
				<Loader class="h-4 w-4 animate-spin" />
			</Center>
		{:then}
			<Sidenav.Root>
				<Sidenav.Nav class="overflow-hidden">
					<SidenavRoutes />
				</Sidenav.Nav>
				<Sidenav.Separator orientation="vertical" />
				<Sidenav.Content>
					<slot />
				</Sidenav.Content>
			</Sidenav.Root>
		{/await}
	</main>

	<Footer />
</Wrapper>
