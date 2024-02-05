<script lang="ts" context="module">
	import { Button } from '$lib/components/ui/button';
	import { Center } from '$lib/components/ui/center';
	import { ExternalLink } from 'lucide-svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type TLink = Record<string, HTMLAnchorAttributes>;

	const LINKS = {
		doc: {
			title: 'Documentation',
			href: 'https://github.com/gustavomorinaga/copyscotch',
			target: '_blank',
			rel: 'noopener noreferrer'
		}
	} satisfies TLink;
</script>

<Center class="select-none">
	<span class="inline-flex space-x-4 text-sm text-muted-foreground">
		<span>Send request</span>
		<div class="space-x-1">
			<kbd>Ctrl</kbd>
			<kbd>&ldca;</kbd>
		</div>
	</span>

	<span class="mt-4 inline-flex">
		<Button variant="outline" {...LINKS.doc}>
			Documentation
			<ExternalLink class="ml-2 h-4 w-4" />
		</Button>
	</span>
</Center>
