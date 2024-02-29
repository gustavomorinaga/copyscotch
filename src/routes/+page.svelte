<script lang="ts">
	import { setRESTContext, setRESTTabContext } from '$lib/contexts';
	import { Spinner } from '$lib/components/ui/spinner';
	import { ViewREST } from '$lib/layouts/rest/views/view-rest';
	import { executeParallel } from '$lib/utils';
</script>

<svelte:head>
	<title>Copyscotch &bull; API development ecosystem</title>
</svelte:head>

{#await executeParallel([setRESTContext, setRESTTabContext])}
	<Spinner />
{:then}
	<ViewREST />
{/await}
