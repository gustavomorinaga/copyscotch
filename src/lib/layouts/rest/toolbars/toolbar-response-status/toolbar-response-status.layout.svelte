<script lang="ts" context="module">
	import { getRESTTabContext, type TRESTResult } from '$lib/contexts';
	import { formatBytes } from '$lib/utils';
	import httpStatus from 'http-status';

	type TStatus = 'success' | 'error';
</script>

<script lang="ts">
	const tabStore = getRESTTabContext();

	function getStatusType(status: number): TStatus {
		if (status >= 200 && status < 300) return 'success';
		return 'error';
	}

	$: result = $tabStore.results.find(({ id }) => id === $tabStore.current) as TRESTResult;
	$: status = getStatusType(result?.response?.status);
</script>

<div
	class="sticky top-0 z-10 flex h-12 select-none items-center bg-background p-4 text-tiny font-semibold"
>
	<div class="inline-flex flex-1 items-center space-x-4">
		<span>
			<span class="text-muted-foreground">Status: </span>
			<span class={status === 'success' ? 'text-success' : 'text-destructive'}>
				{result.response.status}
				&NonBreakingSpace;&bull;&NonBreakingSpace;
				{httpStatus[result.response.status]}
			</span>
		</span>

		<span>
			<span class="text-muted-foreground">Time: </span>
			<span class={status === 'success' ? 'text-success' : 'text-destructive'}>
				{Math.floor(result.response.time)} ms
			</span>
		</span>

		<span>
			<span class="text-muted-foreground">Size: </span>
			<span class={status === 'success' ? 'text-success' : 'text-destructive'}>
				{formatBytes(result.response.blob.size, 2)}
			</span>
		</span>
	</div>
</div>
