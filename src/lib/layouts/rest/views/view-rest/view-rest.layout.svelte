<script lang="ts" context="module">
	import { getSettingsStore, getRESTTabStore } from '$lib/stores';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sidenav from '$lib/components/ui/sidenav';
	import {
		DialogEditRequest,
		SidenavREST,
		ViewEdit,
		ViewResponse,
		ViewWelcome
	} from '$lib/layouts/rest';
</script>

<script lang="ts">
	const [settingsStore, tabStore] = [getSettingsStore(), getRESTTabStore()];

	$: orientation = $settingsStore.layout;
	$: openSidenav = $settingsStore.sidebar === 'open';
</script>

<Sidenav.Root>
	{#if openSidenav}
		<Sidenav.Nav>
			<SidenavREST />
		</Sidenav.Nav>
		<Sidenav.Separator orientation="vertical" />
	{/if}
	<Sidenav.Content class={!openSidenav ? 'w-full' : undefined}>
		{#if $tabStore.tabs.length}
			<div
				class="flex h-full"
				class:flex-col={orientation === 'vertical'}
				class:flex-row={orientation === 'horizontal'}
			>
				<ViewEdit />
				<Separator orientation={orientation === 'horizontal' ? 'vertical' : 'horizontal'} />
				<ViewResponse />
			</div>
		{:else}
			<ViewWelcome />
		{/if}
	</Sidenav.Content>
</Sidenav.Root>

<DialogEditRequest />
