<script lang="ts" context="module">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Plus, Trash2 } from 'lucide-svelte';
	import type { TKeyValueInfer, TRESTRequestInfer } from '$lib/validators';
	import type { SuperForm } from 'sveltekit-superforms';

	const DEFAULT_KEY_VALUE: TKeyValueInfer = {
		key: '',
		value: '',
		active: true
	};
</script>

<script lang="ts">
	type $$Props = { form: SuperForm<TRESTRequestInfer> };

	export let form: $$Props['form'];

	$: ({ form: formData } = form);

	function handleClearAll() {
		$formData.params = [];
	}

	function handleAddNew() {
		$formData.params = [...$formData.params, DEFAULT_KEY_VALUE];
	}
</script>

<div
	class="sticky top-12 z-10 flex h-10 shrink-0 items-center justify-between overflow-x-auto bg-background pl-4"
>
	<div class="flex">
		<span class="select-none truncate text-sm font-semibold text-muted-foreground">
			Query Parameters
		</span>
	</div>

	<div class="flex">
		<Button size="icon" variant="text" on:click={handleClearAll}>
			<Trash2 class="h-4 w-4" />
			<span class="sr-only">Clear all</span>
		</Button>

		<Button size="icon" variant="text" on:click={handleAddNew}>
			<Plus class="h-4 w-4" />
			<span class="sr-only">Add new</span>
		</Button>
	</div>
</div>

<Separator orientation="horizontal" />
