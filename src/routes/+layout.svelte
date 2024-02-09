<script lang="ts">
	import '$lib/styles/app.pcss';
	import { setSettingsStore } from '$lib/stores';
	import { Footer, Toolbar, Wrapper } from '$lib/layouts';
	import { Center } from '$lib/components/ui/center';
	import { executeParallel } from '$lib/utils';
	import { Loader } from 'lucide-svelte';
</script>

<Wrapper class="overflow-hidden">
	<Toolbar />

	<main class="flex flex-auto flex-col">
		{#await executeParallel([setSettingsStore])}
			<Center>
				<Loader class="h-4 w-4 animate-spin" />
			</Center>
		{:then}
			<slot />
		{/await}
	</main>

	<Footer />
</Wrapper>
