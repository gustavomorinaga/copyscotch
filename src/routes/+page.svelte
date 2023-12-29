<script lang="ts">
	import { ViewRest } from '$lib/layouts';
	import { setRESTStore } from '$lib/stores';

	setRESTStore();
</script>

<svelte:head>
	<title>Copyscotch</title>
	<meta name="description" content="My self implementation of Hoppscotch API Client" />
</svelte:head>

<ViewRest />
