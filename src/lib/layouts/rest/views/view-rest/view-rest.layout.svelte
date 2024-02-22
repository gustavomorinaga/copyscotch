<script lang="ts" context="module">
	import { getRESTContext, getRESTTabContext, getSettingsContext } from '$lib/contexts';
	import { DialogEditCollection, SidenavREST, ViewWelcome } from '$lib/layouts/rest';
	import { BREAKPOINTS } from '$lib/maps';
	import { screenStore } from '$lib/components/screen-watcher';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidenav from '$lib/components/ui/sidenav';

	const LAZY_VIEW_COMPONENTS = [
		import('$lib/layouts/rest/views/view-edit'),
		import('$lib/layouts/rest/views/view-response')
	] as const;

	const LAZY_DIALOG_COMPONENTS = [import('$lib/layouts/rest/dialogs/dialog-edit-request')] as const;
</script>

<script lang="ts">
	const [settingsContext, restContext, tabContext] = [
		getSettingsContext(),
		getRESTContext(),
		getRESTTabContext()
	];

	$: ({ layout, sidebar, sidebarPosition } = $settingsContext);
	$: openSidenav = sidebar === 'open';
	$: isMobile = $screenStore.innerWidth < BREAKPOINTS.sm;
	$: if (isMobile) layout = 'vertical';
</script>

<Sidenav.Root class={sidebarPosition === 'left' ? 'flex-row' : 'flex-row-reverse'}>
	{#if openSidenav}
		<Sidenav.Nav class="w-5/12 lg:w-3/12 {isMobile && 'hidden'}">
			<SidenavREST />
		</Sidenav.Nav>
		<Sidenav.Separator orientation="vertical" class={isMobile ? 'hidden' : undefined} />
	{/if}
	<Sidenav.Content class={isMobile || !openSidenav ? 'w-full' : 'w-7/12 lg:w-9/12'}>
		{#if $tabContext.tabs.length}
			<div
				class="flex h-full w-full"
				class:flex-col={layout === 'vertical'}
				class:flex-row={layout === 'horizontal'}
			>
				{#await Promise.all(LAZY_VIEW_COMPONENTS) then [{ ViewEdit }, { ViewResponse }]}
					<ViewEdit />
					<Separator orientation={layout === 'horizontal' ? 'vertical' : 'horizontal'} />
					<ViewResponse />
				{/await}
			</div>
		{:else}
			<ViewWelcome />
		{/if}
	</Sidenav.Content>
</Sidenav.Root>

<DialogEditCollection />

{#if $restContext.length}
	{#await Promise.all(LAZY_DIALOG_COMPONENTS) then loadedComponents}
		{#each loadedComponents as component}
			<svelte:component this={component.default} />
		{/each}
	{/await}
{/if}
