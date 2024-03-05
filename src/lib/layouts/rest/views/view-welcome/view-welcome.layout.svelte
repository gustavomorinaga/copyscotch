<script lang="ts" context="module">
	import { getRESTTabContext } from '$lib/contexts';
	import { Button } from '$lib/components/ui/button';
	import { Center } from '$lib/components/ui/center';
	import Plus from 'lucide-svelte/icons/plus';
</script>

<script lang="ts">
	const tabContext = getRESTTabContext();
</script>

<div
	role="presentation"
	tabindex="-1"
	class="flex h-full cursor-default select-none flex-col focus-visible:focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
	on:dblclick={() => tabContext.add()}
>
	<Center>
		<span aria-hidden="true" class="mb-2 text-8xl opacity-20 grayscale">🛸</span>

		<Button size="lg" variant="outline" aria-label="New Request" on:click={() => tabContext.add()}>
			<Plus class="mr-2 h-4 w-4 shrink-0" />
			<span class="select-none">New Request</span>
		</Button>
	</Center>
</div>
