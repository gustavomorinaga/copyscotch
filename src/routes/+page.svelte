<script lang="ts">
	import { setRESTContext, setRESTTabContext } from '$lib/contexts';
	import { ViewREST } from '$lib/layouts/rest/views/view-rest';
	import { Spinner } from '$lib/components/ui/spinner';
	import { executeParallel } from '$lib/utils';
</script>

{#await executeParallel([setRESTContext, setRESTTabContext])}
	<Spinner />
{:then}
	<ViewREST />
{/await}
