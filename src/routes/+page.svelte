<script lang="ts">
	import { Center } from '$lib/components/ui/center';
	import { ViewREST } from '$lib/layouts';
	import { setRESTStore } from '$lib/stores';
	import { Loader } from 'lucide-svelte';

	export let data;
	let loading = true;

	setRESTStore();
</script>

<svelte:head>
	<title>Copyscotch</title>
	<meta name="description" content="My self implementation of Hoppscotch API Client" />
</svelte:head>

{#if loading}
	<Center class="w-full h-full">
		<Loader class="animate-spin" />
	</Center>
{:else}
	<ViewREST form={data.form} />
{/if}
