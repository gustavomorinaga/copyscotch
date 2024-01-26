<script lang="ts" context="module">
	import { dialogEditCollectionStore as dialogStore } from '$lib/layouts/rest';
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
</script>

<script lang="ts">
	function handleNewCollection() {
		$dialogStore.open = true;
		$dialogStore.mode = 'create';
	}
</script>

<div class="inline-flex h-8 items-center gap-2">
	<Button size="sm" variant="text" on:click={handleNewCollection}>
		<Plus class="mr-2 h-4 w-4" />
		New
	</Button>
</div>
