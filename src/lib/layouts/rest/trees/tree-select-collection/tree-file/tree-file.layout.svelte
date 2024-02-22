<script lang="ts" context="module">
	import {
		DropdownMenuRequestOptions,
		treeSelectCollectionStore as treeStore
	} from '$lib/layouts/rest';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { CheckCircle, MoreVertical } from 'lucide-svelte';
	import type { TRESTRequestInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { file: TRESTRequestInfer };

	export let file: $$Props['file'];
	let openOptions: boolean = false;

	$: selected = $treeStore.selectedID === file.id;

	function handleSelect() {
		if ($treeStore.selectedID === file.id) {
			$treeStore.selectedID = undefined;
			$treeStore.selectedType = undefined;
			return;
		}

		$treeStore.selectedID = file.id;
		$treeStore.selectedType = 'file';
	}
</script>

<Button
	size="sm"
	variant="text"
	data-selected={selected}
	class="group/file w-full flex-1 px-0"
	on:click={handleSelect}
>
	<div
		role="presentation"
		class="flex flex-1 items-center justify-center"
		on:contextmenu={(event) => {
			event.preventDefault();
			openOptions = true;
		}}
	>
		<span
			class="pointer-events-none flex w-16 items-center justify-center truncate px-2 text-tiny group-data-[selected=true]/file:!text-success"
			style="color: hsl(var(--method-{file.method.toLowerCase()}-color) / var(--tw-text-opacity))"
		>
			{#if selected}
				<CheckCircle class="h-5 w-5" />
			{:else}
				{file.method}
			{/if}
		</span>
		<span class="flex flex-1 items-center py-2 pr-2 group-data-[selected=true]/file:!text-success">
			<span class="truncate text-sm">{file.name}</span>
		</span>
	</div>

	<div class="flex items-center">
		<DropdownMenuRequestOptions
			request={file}
			bind:open={openOptions}
			let:builder={dropdownBuilder}
		>
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder={tooltipBuilder}>
					<Button
						builders={[dropdownBuilder, tooltipBuilder]}
						size="icon"
						variant="text"
						class="h-6 w-6"
						on:click={(event) => event.stopPropagation()}
					>
						<MoreVertical class="h-4 w-4" />
						<span class="sr-only">More options</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="top" class="select-none">
					<span>More</span>
				</Tooltip.Content>
			</Tooltip.Root>
		</DropdownMenuRequestOptions>
	</div>
</Button>
