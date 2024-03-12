<script lang="ts" context="module">
	import { DEFAULT_HEADER, type TRESTRequestInfer } from '$lib/validators';
	import { Center } from '$lib/components/ui/center';
	import { Button } from '$lib/components/ui/button';
	import { mode } from '$lib/components/mode-watcher';
	import Plus from 'lucide-svelte/icons/plus';
	import type { SuperForm } from 'sveltekit-superforms';
</script>

<script lang="ts">
	type $$Props = { form: SuperForm<TRESTRequestInfer> };

	export let form: $$Props['form'];

	$: ({ form: formData } = form);

	function handleAddNew() {
		$formData.headers = [...$formData.headers, DEFAULT_HEADER];
	}
</script>

<div class="flex shrink-0 flex-col p-2">
	<Center>
		<figure class="pointer-events-none mt-2 flex max-w-sm select-none flex-col items-center">
			<img
				src="/images/states/{$mode}/add_category.svg"
				alt="Headers are empty"
				loading="lazy"
				class="inline-flex flex-col object-contain object-center"
				width="56"
				height="56"
			/>
			<figcaption
				class="mt-2 max-w-sm whitespace-normal text-center text-tiny text-muted-foreground"
			>
				This request does not have any headers
			</figcaption>
		</figure>

		<div class="mt-4 flex flex-col items-center space-y-4">
			<div class="flex flex-col items-stretch gap-4">
				<Button
					size="sm"
					variant="secondary"
					aria-label="Add New Header"
					class="w-40"
					on:click={handleAddNew}
				>
					<Plus class="mr-2 h-4 w-4 shrink-0" />
					<span class="select-none">Add New</span>
				</Button>
			</div>
		</div>
	</Center>
</div>
