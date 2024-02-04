<script lang="ts" context="module">
	import { getSettingsStore, getRESTTabStore, type TRESTResult } from '$lib/stores';
	import { ToolbarResponse, ToolbarResponseStatus, ViewInstructions } from '$lib/layouts/rest';
	import { Separator } from '$lib/components/ui/separator';
	import { Center } from '$lib/components/ui/center';
	import { CodeMirror } from '$lib/components/ui/codemirror';
	import { Loader } from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';

	type TCodeMirror = ComponentProps<CodeMirror>;

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
</script>

<script lang="ts">
	const [settingsStore, tabStore] = [getSettingsStore(), getRESTTabStore()];

	$: result = $tabStore.results.find(({ id }) => id === $tabStore.current) as TRESTResult;
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

<Separator orientation="horizontal" />

<section class="relative flex h-full flex-1 flex-col overflow-y-auto">
	{#if isSending}
		<Center>
			<Loader class="h-4 w-4 animate-spin" />
		</Center>
	{:else if hasResponse}
		<ToolbarResponseStatus />

		<div class="flex flex-1 flex-col">
			<ToolbarResponse />

			<CodeMirror
				{...CODEMIRROR_CONFIG}
				lang={RESPONSE_TYPES[result.response.blob.type]}
				lineWrapping={$settingsStore.lineWrapping}
				{value}
			/>
		</div>
	{:else}
		<ViewInstructions />
	{/if}
</section>
