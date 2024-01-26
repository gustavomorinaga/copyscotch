<script lang="ts">
	import { setRESTStore, setRESTTabStore } from '$lib/stores';
	import { Center } from '$lib/components/ui/center';
	import { ViewREST } from '$lib/layouts/rest';
	import { executeParallel } from '$lib/utils';
	import { Loader } from 'lucide-svelte';
</script>

{#await executeParallel([setRESTStore, setRESTTabStore])}
	<Center>
		<Loader class="h-4 w-4 animate-spin" />
	</Center>
{:then}
	<ViewREST />
{/await}
