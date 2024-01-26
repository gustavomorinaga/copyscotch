<script lang="ts" context="module">
	import { getSettingsStore, getRESTTabStore } from '$lib/stores';
	import * as Sidenav from '$lib/components/ui/sidenav';
	import { SidenavREST, ViewEdit, ViewResponse, ViewWelcome } from '$lib/layouts/rest';
</script>

<script lang="ts">
	const settingsStore = getSettingsStore();
	const tabStore = getRESTTabStore();

	$: openSidebar = $settingsStore.sidebar === 'open';
</script>

<Sidenav.Root>
	{#if openSidebar}
		<Sidenav.Nav>
			<SidenavREST />
		</Sidenav.Nav>
		<Sidenav.Separator orientation="vertical" />
	{/if}
	<Sidenav.Content class={!openSidebar ? 'w-full' : undefined}>
		{#if $tabStore.tabs.length}
			<ViewEdit />
			<ViewResponse />
		{:else}
			<ViewWelcome />
		{/if}
	</Sidenav.Content>
</Sidenav.Root>
