<script lang="ts">
	import { setRESTStore, setRESTTabStore } from '$lib/stores';
	import { Center } from '$lib/components/ui/center';
	import { ViewREST } from '$lib/layouts';
	import { executeParallel } from '$lib/utils';
	import { Loader } from 'lucide-svelte';

	export let data;
	let loading = true;

	(async () => {
		await executeParallel([setRESTStore, setRESTTabStore]).finally(() => (loading = false));
	})();
</script>

{#if loading}
	<Center>
		<Loader class="animate-spin w-4 h-4" />
	</Center>
{:else}
	<ViewREST form={data.form} />
{/if}
