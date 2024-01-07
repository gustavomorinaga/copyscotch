<script lang="ts">
	import { Center } from '$lib/components/ui/center';
	import { ViewREST } from '$lib/layouts';
	import { setRESTStore } from '$lib/stores';
	import { Loader } from 'lucide-svelte';

	export let data;
	let loading = false;

	const loadStore = new Promise((resolve) => resolve(setRESTStore()));

	(async () => {
		loading = true;
		loadStore.finally(() => (loading = false));
	})();
</script>

<svelte:head>
	<title>Copyscotch</title>
	<meta name="description" content="My self implementation of Hoppscotch API Client" />
</svelte:head>

{#if loading}
	<Center>
		<Loader class="animate-spin w-4 h-4" />
	</Center>
{:else}
	<ViewREST form={data.form} />
{/if}
