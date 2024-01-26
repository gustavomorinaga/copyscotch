<script lang="ts">
	import '$lib/styles/app.pcss';
	import { setSettingsStore } from '$lib/stores';
	import { Footer, Toolbar, Wrapper } from '$lib/layouts';
	import { Center } from '$lib/components/ui/center';
	import { Separator } from '$lib/components/ui/separator';
	import { executeParallel } from '$lib/utils';
	import { Loader } from 'lucide-svelte';
</script>

<Wrapper>
	<Toolbar />
	<Separator orientation="horizontal" />

	<main class="flex flex-auto flex-col">
		{#await executeParallel([setSettingsStore])}
			<Center>
				<Loader class="h-4 w-4 animate-spin" />
			</Center>
		{:then}
			<slot />
		{/await}
	</main>

	<Separator orientation="horizontal" />
	<Footer />
</Wrapper>
