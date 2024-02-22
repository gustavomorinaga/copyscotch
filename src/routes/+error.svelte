<script lang="ts">
	import { page } from '$app/stores';
	import { mode } from '$lib/components/mode-watcher';
	import { Button } from '$lib/components/ui/button';
	import { Home, RefreshCw } from 'lucide-svelte';

	function handleReload() {
		return location.reload();
	}
</script>

<div class="flex min-w-0 flex-1 flex-col items-center justify-center">
	<img
		src="/images/states/{$mode}/youre_lost.svg"
		alt="This page could not be found"
		loading="lazy"
		class="h-46 w-46 mb-2 inline-flex flex-col object-contain object-center"
	/>

	<h1 class="mb-4 text-xl font-bold">{$page.status}</h1>
	<p class="mb-4 text-sm text-muted-foreground">This page could not be found</p>

	<div class="mt-4 inline-flex gap-2">
		<Button size="sm" variant="secondary" href="/">
			<Home class="mr-2 h-4 w-4" />
			Home
		</Button>
		<Button size="sm" variant="secondary" on:click={handleReload}>
			<RefreshCw class="mr-2 h-4 w-4" />
			Reload
		</Button>
	</div>
</div>
