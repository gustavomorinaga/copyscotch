<script lang="ts">
	import { ViewRest } from '$lib/layouts';
	import { setRESTStore } from '$lib/stores';

	export let data;

	setRESTStore();
</script>

<svelte:head>
	<title>Copyscotch</title>
	<meta name="description" content="My self implementation of Hoppscotch API Client" />
</svelte:head>

<ViewRest form={data.form} />
