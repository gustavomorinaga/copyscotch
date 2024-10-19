<script lang="ts" context="module">
	import ExternalLink from 'lucide-svelte/icons/external-link';
	import { Button } from '$lib/components/ui/button';
	import { Center } from '$lib/components/ui/center';
	import * as Shortcut from '$lib/components/ui/shortcut';
	import { LINKS } from '$lib/constants/links';
	import { SHORTCUTS } from '$lib/constants/shortcuts';
	import { UNICODES } from '$lib/constants/unicodes';
</script>

<Center class="select-none bg-background">
	<Shortcut.Root class="mb-4 gap-4">
		<div class="flex flex-col items-end gap-2 text-right">
			<span class="flex flex-1 items-center">Send Request</span>
		</div>

		<div class="flex flex-col gap-2">
			<div class="inline-flex gap-1">
				{#each SHORTCUTS.send.modifier as modifier}
					<Shortcut.Key>{modifier}</Shortcut.Key>
				{/each}
				<Shortcut.Key>
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html UNICODES[SHORTCUTS.send.key]}
				</Shortcut.Key>
			</div>
		</div>
	</Shortcut.Root>

	<span class="inline-flex">
		<Button variant="outline" {...LINKS.github} title={undefined} aria-label="Documentation">
			<span class="select-none">Documentation</span>
			<ExternalLink class="ml-2 h-4 w-4 shrink-0" />
		</Button>
	</span>
</Center>
