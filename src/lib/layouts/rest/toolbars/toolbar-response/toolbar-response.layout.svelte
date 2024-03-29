<script lang="ts" context="module">
	import { getSettingsContext, getRESTTabContext, type TRESTResult } from '$lib/contexts';
	import { Button } from '$lib/components/ui/button';
	import { Toggle } from '$lib/components/ui/toggle';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Check from 'lucide-svelte/icons/check';
	import Copy from 'lucide-svelte/icons/copy';
	import WrapText from 'lucide-svelte/icons/wrap-text';
	import type { ComponentType } from 'svelte';

	type TClipboardState = 'default' | 'copied';

	const CLIPBOARD_CONFIG = { replacer: null, space: 2 };
	const CLIPBOARD_STATES: Record<TClipboardState, { icon: ComponentType; label: string }> = {
		default: {
			icon: Copy,
			label: 'Copy'
		},
		copied: {
			icon: Check,
			label: 'Copied'
		}
	} as const;
</script>

<script lang="ts">
	const [settingsContext, tabContext] = [getSettingsContext(), getRESTTabContext()];

	let clipboardState: TClipboardState = 'default';

	$: result = $tabContext.results.find(({ id }) => id === $tabContext.current) as TRESTResult;

	function handleClipboard() {
		const { replacer, space } = CLIPBOARD_CONFIG;
		const value = JSON.stringify(result.response.json, replacer, space);
		return navigator.clipboard.writeText(value).then(handleCopyDone, handleCopyError);
	}

	function handleCopyDone() {
		clipboardState = 'copied';
		setTimeout(() => (clipboardState = 'default'), 1000);
	}

	function handleCopyError() {
		console.error('Failed to copy to clipboard');
	}
</script>

<div
	class="sticky top-12 z-10 flex h-10 shrink-0 items-center justify-between overflow-x-auto border-y border-border bg-background pl-4"
>
	<div class="flex">
		<span class="select-none truncate text-sm font-semibold text-muted-foreground">
			Body Response
		</span>
	</div>

	<div class="flex">
		<Toggle
			size="sm"
			variant="primary"
			aria-label="Toggle Line Wrapping"
			class="rounded-none"
			bind:pressed={$settingsContext.lineWrapping}
		>
			<WrapText class="h-4 w-4 shrink-0" />
			<span class="sr-only select-none">Line Wrapping</span>
		</Toggle>

		<Tooltip.Root closeOnPointerDown={false}>
			<Tooltip.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					size="sm"
					variant="text"
					aria-label="Copy Response"
					class="rounded-none"
					disabled={clipboardState === 'copied'}
					on:click={handleClipboard}
				>
					<svelte:component this={CLIPBOARD_STATES[clipboardState].icon} class="h-4 w-4 shrink-0" />
					<span class="sr-only select-none">{CLIPBOARD_STATES[clipboardState].label}</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="top" class="select-none">
				<span>{CLIPBOARD_STATES[clipboardState].label}</span>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</div>
