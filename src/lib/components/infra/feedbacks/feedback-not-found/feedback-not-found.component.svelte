<script lang="ts" module>
	import Search from 'lucide-svelte/icons/search';
</script>

<script lang="ts">
	

	interface Props {
		term?: string;
	}

	let { term = undefined }: Props = $props();
</script>

<div class="flex select-none flex-col items-center justify-center p-4">
	<Search class="h-6 w-6 shrink-0 text-muted-foreground/50" />
	<span
		class="mt-2 max-w-sm whitespace-normal break-words text-center text-tiny text-muted-foreground/50"
	>
		Nothing found for "{term}"
	</span>
</div>
