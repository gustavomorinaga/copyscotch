<script lang="ts" context="module">
	import httpStatus, { type HttpStatus } from 'http-status';
	import { type TRESTResult, getRESTTabContext } from '$lib/contexts/rest';
	import { formatBytes } from '$lib/utils';

	type TStatus = 'success' | 'error';
</script>

<script lang="ts">
	const tabContext = getRESTTabContext();

	function getStatusType(status: number): TStatus {
		if (status >= 200 && status < 300) return 'success';
		return 'error';
	}

	$: result = $tabContext.results.find(({ id }) => id === $tabContext.current) as TRESTResult;
	$: status = getStatusType(result?.response?.status);
	$: statusCode = httpStatus[result?.response?.status as keyof HttpStatus];
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
				{statusCode}
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
