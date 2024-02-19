<script lang="ts" context="module">
	import { getSettingsStore, getRESTTabStore } from '$lib/stores';
	import { BREAKPOINTS } from '$lib/maps';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidenav from '$lib/components/ui/sidenav';
	import { screenStore } from '$lib/components/screen-watcher';
	import { DialogEditRequest, SidenavREST, ViewWelcome } from '$lib/layouts/rest';

	const LAZY_COMPONENTS = [
		import('$lib/layouts/rest/views/view-edit').then((m) => m.ViewEdit),
		import('$lib/layouts/rest/views/view-response').then((m) => m.ViewResponse)
	] as const;
</script>

<script lang="ts">
	const [settingsStore, tabStore] = [getSettingsStore(), getRESTTabStore()];

	$: orientation = $settingsStore.layout;
	$: openSidenav = $settingsStore.sidebar === 'open';
	$: isMobile = $screenStore.innerWidth < BREAKPOINTS.sm;
	$: if (isMobile) $settingsStore.layout = 'vertical';
</script>

<Sidenav.Root>
	{#if openSidenav}
		<Sidenav.Nav class="w-3/12 {isMobile && 'hidden'}">
			<SidenavREST />
		</Sidenav.Nav>
		<Sidenav.Separator orientation="vertical" class={isMobile ? 'hidden' : undefined} />
	{/if}
	<Sidenav.Content class={isMobile || !openSidenav ? 'w-full' : 'w-9/12'}>
		{#if $tabStore.tabs.length}
			<div
				class="flex h-full w-full"
				class:flex-col={orientation === 'vertical'}
				class:flex-row={orientation === 'horizontal'}
			>
				{#await Promise.all(LAZY_COMPONENTS) then [ViewEdit, ViewResponse]}
					<ViewEdit />
					<Separator orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'} />
					<ViewResponse />
				{/await}
			</div>
		{:else}
			<ViewWelcome />
		{/if}
	</Sidenav.Content>
</Sidenav.Root>

<DialogEditRequest />
