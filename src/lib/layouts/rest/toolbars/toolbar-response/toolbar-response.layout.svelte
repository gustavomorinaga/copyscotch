<script lang="ts" context="module">
	import { getSettingsStore } from '$lib/stores';
	import { Toggle } from '$lib/components/ui/toggle';
	import { WrapText } from 'lucide-svelte';
</script>

<script lang="ts">
	const settingsStore = getSettingsStore();
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
			bind:pressed={$settingsStore.lineWrapping}
		>
			<WrapText class="h-4 w-4" />
			<span class="sr-only">Line Wrapping</span>
		</Toggle>
	</div>
</div>
