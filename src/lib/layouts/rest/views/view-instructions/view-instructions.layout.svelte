<script lang="ts" context="module">
	import { Button } from '$lib/components/ui/button';
	import { Center } from '$lib/components/ui/center';
	import * as Shortcut from '$lib/components/ui/shortcut';
	import { LINKS, SHORTCUTS, UNICODES } from '$lib/maps';
	import { ExternalLink } from 'lucide-svelte';
</script>

<Center class="select-none bg-background">
	<Shortcut.Root>
		<span class="mr-4">Send request</span>
		{#each SHORTCUTS.send.modifier as modifier}
			<Shortcut.Key>{modifier}</Shortcut.Key>
		{/each}
		<Shortcut.Key>{@html UNICODES[SHORTCUTS.send.key]}</Shortcut.Key>
	</Shortcut.Root>

	<span class="mt-4 inline-flex">
		<Button variant="outline" {...LINKS.github} title={undefined} aria-label="Documentation">
			<span>Documentation</span>
			<ExternalLink class="ml-2 h-4 w-4" />
		</Button>
	</span>
</Center>
