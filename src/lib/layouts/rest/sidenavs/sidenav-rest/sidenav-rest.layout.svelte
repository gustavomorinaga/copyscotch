<script lang="ts" context="module">
	import { getRESTStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { TreeCollection } from '$lib/layouts';
	import { ChevronRight, Plus } from 'lucide-svelte';
</script>

<script lang="ts">
	const restStore = getRESTStore();
</script>

<div
	class="inline-flex select-none items-center gap-2 overflow-x-auto whitespace-nowrap px-4 py-2 text-tiny text-muted-foreground"
>
	<span>My Workspace</span>
	<ChevronRight class="h-3 w-3" />
	<span>Collections</span>
</div>

<Separator orientation="horizontal" />

<div class="inline-flex items-center gap-2">
	<Button size="sm" variant="ghost" class="rounded-none">
		<Plus class="mr-2 h-4 w-4" />
		New
	</Button>
</div>

<Separator orientation="horizontal" />

<div class="flex flex-col p-2">
	<TreeCollection folders={$restStore} />
</div>
