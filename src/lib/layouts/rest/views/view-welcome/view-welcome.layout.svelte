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
	class="flex h-full cursor-default select-none flex-col"
	on:dblclick={() => tabContext.add()}
>
	<Center>
		<Button size="sm" variant="outline" aria-label="New Request" on:click={() => tabContext.add()}>
			<Plus class="mr-2 h-4 w-4" />
			<span class="select-none">New Request</span>
		</Button>
	</Center>
</div>
