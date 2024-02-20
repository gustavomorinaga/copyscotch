<script lang="ts" context="module">
	import { getRESTTabContext } from '$lib/contexts';
	import { Button } from '$lib/components/ui/button';
	import { Center } from '$lib/components/ui/center';
	import { Plus } from 'lucide-svelte';
</script>

<script lang="ts">
	const tabStore = getRESTTabContext();
</script>

<div
	role="presentation"
	tabindex="-1"
	class="flex h-full cursor-default select-none flex-col"
	on:dblclick={() => tabStore.add()}
>
	<Center>
		<Button size="sm" variant="outline" on:click={() => tabStore.add()}>
			<Plus class="mr-2 h-4 w-4" />
			New Request
		</Button>
	</Center>
</div>
