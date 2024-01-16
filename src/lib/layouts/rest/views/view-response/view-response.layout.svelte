<script lang="ts" context="module">
	import { getRESTTabStore, type TRESTResult } from '$lib/stores';
	import { Separator } from '$lib/components/ui/separator';
	import { Center } from '$lib/components/ui/center';
	import { Loader } from 'lucide-svelte';
	import { formatBytes } from '$lib/utils';
</script>

<script lang="ts">
	const tabStore = getRESTTabStore();

	$: currentResult = $tabStore.results.find(({ id }) => id === $tabStore.current) as TRESTResult;
	$: isSending = currentResult?.sending;
	$: hasResponse = Boolean(currentResult?.response);
</script>

<Separator orientation="horizontal" role="presentation" />

<section class="block h-[50dvh]">
	{#if isSending}
		<Center>
			<Loader class="h-4 w-4 animate-spin" />
		</Center>
	{:else if hasResponse}
		<header class="flex select-none items-center p-4 text-tiny font-semibold">
			<div class="inline-flex flex-1 space-x-4">
				<span>
					<span class="text-muted-foreground">Status: </span>
					<span class="text-success">{currentResult.response.status}</span>
				</span>

				<span>
					<span class="text-muted-foreground">Time: </span>
					<span class="text-success">{Math.floor(currentResult.response.time)} ms</span>
				</span>

				<span>
					<span class="text-muted-foreground">Size: </span>
					<span class="text-success">{formatBytes(currentResult.response.blob.size, 2)}</span>
				</span>
			</div>
		</header>
	{:else}
		<Center>
			<span class="inline-flex space-x-4 text-sm text-muted-foreground">
				<span>Send request</span>
				<div class="space-x-1">
					<kbd>Ctrl</kbd>
					<kbd>⤶</kbd>
				</div>
			</span>
		</Center>
	{/if}
</section>
