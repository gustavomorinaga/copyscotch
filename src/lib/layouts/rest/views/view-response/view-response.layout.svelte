<script lang="ts" context="module">
	import { getSettingsStore, getRESTTabStore, type TRESTResult } from '$lib/stores';
	import { ToolbarResponse, ToolbarResponseStatus } from '$lib/layouts/rest';
	import { Separator } from '$lib/components/ui/separator';
	import { Center } from '$lib/components/ui/center';
	import { CodeMirror } from '$lib/components/ui/codemirror';
	import { Loader } from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';

	const CODEMIRROR_CONFIG: ComponentProps<CodeMirror> = {
		lang: 'json',
		editable: true,
		readonly: true,
		useTab: false,
		tabSize: 2,
		nodebounce: true
	} as const;
</script>

<script lang="ts">
	const [settingsStore, tabStore] = [getSettingsStore(), getRESTTabStore()];

	function formatBody(body: any) {
		const replacer = null;
		return JSON.stringify(body, replacer, CODEMIRROR_CONFIG.tabSize);
	}

	$: result = $tabStore.results.find(({ id }) => id === $tabStore.current) as TRESTResult;
	$: isSending = result?.sending;
	$: hasResponse = Boolean(result?.response);
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
				lineWrapping={$settingsStore.lineWrapping}
				value={formatBody(result.response.json)}
			/>
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
