<script lang="ts" context="module">
	import { getSettingsContext, getRESTTabContext, type TRESTResult } from '$lib/contexts';
	import { ViewInstructions } from '$lib/layouts/rest';
	import { Center } from '$lib/components/ui/center';
	import { Loader } from 'lucide-svelte';
	import type { Props as TCodeMirror } from '$lib/components/ui/codemirror';

	const CODEMIRROR_CONFIG: TCodeMirror = {
		editable: true,
		readonly: true,
		useTab: false,
		tabSize: 2,
		nodebounce: true
	} as const;

	const RESPONSE_TYPES: Record<string, TCodeMirror['lang']> = {
		'application/json': 'json',
		'text/html': 'html',
		'text/plain': undefined
	} as const;

	const LAZY_COMPONENTS = [
		import('$lib/components/ui/codemirror').then((m) => m.CodeMirror),
		import('$lib/layouts/rest/toolbars/toolbar-response').then((m) => m.ToolbarResponse),
		import('$lib/layouts/rest/toolbars/toolbar-response-status').then(
			(m) => m.ToolbarResponseStatus
		)
	] as const;
</script>

<script lang="ts">
	const [settingsContext, tabContext] = [getSettingsContext(), getRESTTabContext()];

	$: result = $tabContext.results.find(({ id }) => id === $tabContext.current) as TRESTResult;
	$: isSending = result?.sending;
	$: hasResponse = Boolean(result?.response);
	$: value = hasResponse
		? result.response.json
			? formatBody(result.response.json)
			: result.response.raw
		: undefined;

	function formatBody(body: any) {
		const replacer = null;
		return JSON.stringify(body, replacer, CODEMIRROR_CONFIG.tabSize);
	}
</script>

<section class="relative flex h-full flex-1 flex-col overflow-y-auto">
	{#if isSending && !hasResponse}
		<Center>
			<Loader class="h-4 w-4 animate-spin" />
		</Center>
	{:else if hasResponse}
		{#await Promise.all(LAZY_COMPONENTS) then [CodeMirror, ToolbarResponse, ToolbarResponseStatus]}
			<ToolbarResponseStatus />

			<div class="flex flex-1 flex-col">
				<ToolbarResponse />

				<CodeMirror
					{...CODEMIRROR_CONFIG}
					lang={RESPONSE_TYPES[result.response.blob.type]}
					lineWrapping={$settingsContext.lineWrapping}
					{value}
				/>
			</div>
		{/await}
	{:else}
		<ViewInstructions />
	{/if}
</section>
