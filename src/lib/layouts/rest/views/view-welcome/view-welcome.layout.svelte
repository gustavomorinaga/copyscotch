<script lang="ts" context="module">
	import { getRESTTabContext } from '$lib/contexts';
	import { SHORTCUTS, type TShortcut } from '$lib/maps';
	import { Center } from '$lib/components/ui/center';
	import * as Shortcut from '$lib/components/ui/shortcut';

	const SELECTED_SHORTCUTS = [
		{ ...SHORTCUTS.fullscreen, label: 'Toggle Fullscreen' },
		{ ...SHORTCUTS.newTab, label: 'New Request' }
	] as const satisfies Array<TShortcut & { label: string }>;
</script>

<script lang="ts">
	const tabContext = getRESTTabContext();
</script>

<div
	role="presentation"
	tabindex="-1"
	class="flex h-full cursor-default select-none flex-col focus-visible:focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
	on:dblclick={() => tabContext.addTab()}
>
	<Center>
		<figure
			aria-hidden="true"
			class="pointer-events-none mb-2 aspect-square select-none opacity-10 grayscale"
		>
			<img src="/logo.svg" alt="Copyscotch watermark" loading="lazy" width="112" height="112" />
		</figure>

		<Shortcut.Root class="mb-4 gap-4">
			<div class="flex flex-col items-end gap-2 text-right">
				{#each SELECTED_SHORTCUTS as { label }}
					<span class="flex flex-1 items-center">{label}</span>
				{/each}
			</div>

			<div class="flex flex-col gap-2">
				{#each SELECTED_SHORTCUTS as { modifier, key }}
					<div class="inline-flex gap-1">
						{#each modifier as modifier}
							<Shortcut.Key>{modifier}</Shortcut.Key>
						{/each}
						<Shortcut.Key>{key}</Shortcut.Key>
					</div>
				{/each}
			</div>
		</Shortcut.Root>
	</Center>
</div>
