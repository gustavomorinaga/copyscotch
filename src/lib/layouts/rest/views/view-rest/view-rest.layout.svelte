<script lang="ts" context="module">
	import { getRESTContext, getRESTTabContext, getSettingsContext } from '$lib/contexts';
	import { BREAKPOINTS } from '$lib/maps';
	import { SidenavREST } from '$lib/layouts/rest/sidenavs/sidenav-rest';
	import { ViewWelcome } from '$lib/layouts/rest/views/view-welcome';
	import { screenStore } from '$lib/components/screen-watcher';
	import * as Resizable from '$lib/components/ui/resizable';

	const LAZY_VIEW_COMPONENTS = [
		import('$lib/layouts/rest/views/view-editor'),
		import('$lib/layouts/rest/views/view-response')
	] as const;

	const LAZY_DIALOG_COMPONENTS = [
		import('$lib/layouts/rest/dialogs/dialog-import'),
		import('$lib/layouts/rest/dialogs/dialog-edit-collection'),
		import('$lib/layouts/rest/dialogs/dialog-edit-request')
	] as const;
</script>

<script lang="ts">
	const [settingsContext, restContext, tabContext] = [
		getSettingsContext(),
		getRESTContext(),
		getRESTTabContext()
	];

	$: ({ layout, sidebar, sidebarPosition } = $settingsContext);
	$: isMobile = $screenStore.innerWidth < BREAKPOINTS.sm;
	$: openSidenav = isMobile ? false : sidebar === 'open';
	$: if (isMobile) layout = 'vertical';

	function handleKeydown(event: KeyboardEvent) {
		if (event.ctrlKey && event.altKey && event.key === 'n') {
			event.preventDefault();
			tabContext.add();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<Resizable.PaneGroup
	autoSaveId="sidenav"
	direction="horizontal"
	class={sidebarPosition === 'left' ? '!flex-row' : '!flex-row-reverse'}
>
	{#if openSidenav}
		<Resizable.Pane
			defaultSize={25}
			minSize={25}
			maxSize={35}
			order={sidebarPosition === 'left' ? 1 : 2}
		>
			<SidenavREST />
		</Resizable.Pane>

		<Resizable.Handle class="z-30" />
	{/if}

	<Resizable.Pane defaultSize={75} order={sidebarPosition === 'right' ? 1 : 2}>
		{#if $tabContext.tabs.length}
			<Resizable.PaneGroup autoSaveId="editor" direction={layout} class="flex h-full w-full">
				{#await Promise.all(LAZY_VIEW_COMPONENTS) then [{ ViewEditor }, { ViewResponse }]}
					<Resizable.Pane defaultSize={1 / 2} minSize={35}>
						<ViewEditor />
					</Resizable.Pane>

					<Resizable.Handle class="z-30" />

					<Resizable.Pane defaultSize={1 / 2} minSize={25}>
						<ViewResponse />
					</Resizable.Pane>
				{/await}
			</Resizable.PaneGroup>
		{:else}
			<ViewWelcome />
		{/if}
	</Resizable.Pane>
</Resizable.PaneGroup>

{#if $settingsContext.sidebar === 'open' || $tabContext.tabs.length}
	{#await LAZY_DIALOG_COMPONENTS[0] then { DialogImport }}
		<DialogImport />
	{/await}
{/if}

{#if $settingsContext.sidebar === 'open' || $tabContext.tabs.length}
	{#await LAZY_DIALOG_COMPONENTS[1] then { DialogEditCollection }}
		<DialogEditCollection />
	{/await}
{/if}

{#if ($settingsContext.sidebar === 'open' && $restContext.length) || $tabContext.tabs.length}
	{#await LAZY_DIALOG_COMPONENTS[2] then { DialogEditRequest }}
		<DialogEditRequest />
	{/await}
{/if}
