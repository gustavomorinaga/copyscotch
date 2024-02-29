<script lang="ts">
	import { page } from '$app/stores';
	import { mode } from '$lib/components/mode-watcher';
	import { Button } from '$lib/components/ui/button';
	import Home from 'lucide-svelte/icons/home';
	import RefreshCw from 'lucide-svelte/icons/refresh-cw';

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
		<Button size="sm" variant="secondary" href="/" aria-label="Go to Home Page">
			<Home class="mr-2 h-4 w-4" />
			<span>Home</span>
		</Button>
		<Button size="sm" variant="secondary" aria-label="Reload Page" on:click={handleReload}>
			<RefreshCw class="mr-2 h-4 w-4" />
			<span>Reload</span>
		</Button>
	</div>
</div>
