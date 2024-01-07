<script lang="ts">
	import { onMount } from 'svelte';
	import { setRESTStore } from '$lib/stores';
	import { Center } from '$lib/components/ui/center';
	import { ViewREST } from '$lib/layouts';
	import { Loader } from 'lucide-svelte';

	export let data;
	let loading = true;

	const loadStore = new Promise((resolve) => resolve(setRESTStore()));

	onMount(async () => {
		await loadStore.finally(() => (loading = false));
	});
</script>

<svelte:head>
	<title>Copyscotch • API development ecosystem</title>
	<meta name="description" content="My self implementation of Hoppscotch API Client" />
</svelte:head>

{#if loading}
	<Center>
		<Loader class="animate-spin w-4 h-4" />
	</Center>
{:else}
	<ViewREST forms={data.forms} />
{/if}
