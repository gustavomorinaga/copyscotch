<script lang="ts" context="module">
	import { Search } from 'lucide-svelte';
</script>

<script lang="ts">
	type $$Props = { term?: string };

	export let term: $$Props['term'] = undefined;
</script>

<div class="flex select-none flex-col items-center justify-center p-4">
	<Search class="h-6 w-6 text-muted-foreground/50" />
	<span
		class="mt-2 max-w-sm whitespace-normal break-words text-center text-tiny text-muted-foreground/50"
	>
		Nothing found for "{term}"
	</span>
</div>
