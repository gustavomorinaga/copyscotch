<script lang="ts" context="module">
	import { getSettingsStore, getRESTTabStore } from '$lib/stores';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidenav from '$lib/components/ui/sidenav';
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
</script>

<Sidenav.Root>
	{#if openSidenav}
		<Sidenav.Nav class="w-3/12">
			<SidenavREST />
		</Sidenav.Nav>
		<Sidenav.Separator orientation="vertical" />
	{/if}
	<Sidenav.Content class={!openSidenav ? 'w-full' : 'w-9/12'}>
		{#if $tabStore.tabs.length}
			<div
				class="flex h-full"
				class:flex-col={orientation === 'vertical'}
				class:flex-row={orientation === 'horizontal'}
			>
				{#await Promise.all(LAZY_COMPONENTS) then [ViewEdit, ViewResponse]}
					<ViewEdit />
					<Separator {orientation} />
					<ViewResponse />
				{/await}
			</div>
		{:else}
			<ViewWelcome />
		{/if}
	</Sidenav.Content>
</Sidenav.Root>

<DialogEditRequest />
