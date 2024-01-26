<script lang="ts" context="module">
	import { getRESTTabStore } from '$lib/stores';
	import * as Sidenav from '$lib/components/ui/sidenav';
	import { SidenavREST, ViewEdit, ViewResponse, ViewWelcome } from '$lib/layouts/rest';
</script>

<script lang="ts">
	const tabStore = getRESTTabStore();
</script>

<Sidenav.Root>
	<Sidenav.Nav>
		<SidenavREST />
	</Sidenav.Nav>
	<Sidenav.Separator orientation="vertical" />
	<Sidenav.Content>
		{#if $tabStore.tabs.length}
			<ViewEdit />
			<ViewResponse />
		{:else}
			<ViewWelcome />
		{/if}
	</Sidenav.Content>
</Sidenav.Root>
