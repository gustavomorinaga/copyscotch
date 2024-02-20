<script lang="ts">
	import { setRESTContext, setRESTTabContext } from '$lib/contexts';
	import { Center } from '$lib/components/ui/center';
	import { ViewREST } from '$lib/layouts/rest';
	import { executeParallel } from '$lib/utils';
	import { Loader } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Copyscotch &bull; API development ecosystem</title>
</svelte:head>

{#await executeParallel([setRESTContext, setRESTTabContext])}
	<Center>
		<Loader class="h-4 w-4 animate-spin" />
	</Center>
{:then}
	<ViewREST />
{/await}
