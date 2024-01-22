<script lang="ts" context="module">
	import { getRESTTabStore, type TRESTResult } from '$lib/stores';
	import { Separator } from '$lib/components/ui/separator';
	import { Center } from '$lib/components/ui/center';
	import { CodeMirror } from '$lib/components/ui/codemirror';
	import { Loader } from 'lucide-svelte';
	import { formatBytes } from '$lib/utils';
	import httpStatus from 'http-status';

	type TStatus = 'success' | 'error';
</script>

<script lang="ts">
	const tabStore = getRESTTabStore();

	function getStatusType(status: number): TStatus {
		if (status >= 200 && status < 300) return 'success';
		return 'error';
	}

	function formatBody(body: any) {
		const replacer = null;
		const tabSize = 2;
		return JSON.stringify(body, replacer, tabSize);
	}

	$: currentResult = $tabStore.results.find(({ id }) => id === $tabStore.current) as TRESTResult;
	$: isSending = currentResult?.sending;
	$: hasResponse = Boolean(currentResult?.response);
	$: status = getStatusType(currentResult?.response?.status);
</script>

<Separator orientation="horizontal" />

<section class="relative flex h-full flex-1 flex-col overflow-y-auto">
	{#if isSending}
		<Center>
			<Loader class="h-4 w-4 animate-spin" />
		</Center>
	{:else if hasResponse}
		<div
			class="sticky top-0 z-10 flex h-12 select-none items-center bg-background p-4 text-tiny font-semibold"
		>
			<div class="inline-flex flex-1 items-center space-x-4">
				<span>
					<span class="text-muted-foreground">Status: </span>
					<span class={status === 'success' ? 'text-success' : 'text-destructive'}>
						{currentResult.response.status}
						&NonBreakingSpace;&bull;&NonBreakingSpace;
						{httpStatus[currentResult.response.status]}
					</span>
				</span>

				<span>
					<span class="text-muted-foreground">Time: </span>
					<span class={status === 'success' ? 'text-success' : 'text-destructive'}>
						{Math.floor(currentResult.response.time)} ms
					</span>
				</span>

				<span>
					<span class="text-muted-foreground">Size: </span>
					<span class={status === 'success' ? 'text-success' : 'text-destructive'}>
						{formatBytes(currentResult.response.blob.size, 2)}
					</span>
				</span>
			</div>
		</div>

		<div class="flex flex-1 flex-col">
			<div
				class="sticky top-12 z-10 flex h-10 shrink-0 items-center justify-between overflow-x-auto border-y border-border bg-background pl-4"
			>
				<span class="truncate text-sm font-semibold text-muted-foreground">Body Response</span>
			</div>

			<CodeMirror value={formatBody(currentResult.response.json)} lang="json" />
		</div>
	{:else}
		<Center class="select-none">
			<span class="inline-flex space-x-4 text-sm text-muted-foreground">
				<span>Send request</span>
				<div class="space-x-1">
					<kbd>Ctrl</kbd>
					<kbd>&ldca;</kbd>
				</div>
			</span>
		</Center>
	{/if}
</section>
