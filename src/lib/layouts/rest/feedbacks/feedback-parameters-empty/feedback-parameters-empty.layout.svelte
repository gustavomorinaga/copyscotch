<script lang="ts" context="module">
	import { Center } from '$lib/components/ui/center';
	import { Button } from '$lib/components/ui/button';
	import { mode } from '$lib/components/mode-watcher';
	import { Plus } from 'lucide-svelte';
</script>

<script lang="ts">
	function handleNewParameter() {}
</script>

<div class="flex flex-col p-2">
	<Center>
		<div class="mt-2 flex max-w-sm select-none flex-col items-center">
			<img
				src="/images/states/{$mode}/add_files.svg"
				alt="Collections are empty"
				loading="lazy"
				class="inline-flex h-16 w-16 flex-col object-contain object-center"
			/>
			<span class="mt-2 max-w-sm whitespace-normal text-center text-tiny text-muted-foreground">
				This request does not have any parameters
			</span>
		</div>

		<div class="mt-4 flex flex-col items-center space-y-4">
			<div class="flex flex-col items-stretch gap-4">
				<Button
					size="sm"
					variant="secondary"
					aria-label="Add New Parameter"
					class="w-40"
					on:click={handleNewParameter}
				>
					<Plus class="mr-2 h-4 w-4" />
					<span>Add New</span>
				</Button>
			</div>
		</div>
	</Center>
</div>
