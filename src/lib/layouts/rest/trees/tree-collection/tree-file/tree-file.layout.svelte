<script lang="ts" context="module">
	import { getRESTTabContext } from '$lib/contexts';
	import { DropdownMenuRequestOptions, treeCollectionStore as treeStore } from '$lib/layouts/rest';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Dot, MoreVertical } from 'lucide-svelte';
	import type { TRESTRequestInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { file: TRESTRequestInfer };

	export let file: $$Props['file'];
	let openOptions: boolean = false;

	const tabContext = getRESTTabContext();

	$: current = $tabContext.current === file.id;
	$: selected = $treeStore.selected === file.id;

	function handleOpenFile(event: MouseEvent) {
		event.stopPropagation();
		$treeStore.selected = file.id;
		tabContext.get(file.id) ? tabContext.setCurrent(file.id) : tabContext.add(file);
	}
</script>

<Button
	size="sm"
	variant="text"
	role="treeitem"
	aria-label={file.name}
	aria-current={current}
	aria-selected={selected}
	tabindex={selected ? 0 : -1}
	class="group/file w-full flex-1 px-0"
	on:click={handleOpenFile}
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
			class="pointer-events-none flex w-16 items-center justify-center truncate px-2 text-tiny"
			style="color: hsl(var(--method-{file.method.toLowerCase()}-color) / var(--tw-text-opacity))"
		>
			{file.method}
		</span>
		<span class="flex flex-1 items-center py-2 pr-2">
			<span class="truncate text-sm">{file.name}</span>

			{#if current}
				<div
					role="presentation"
					class="relative mx-3 flex h-2 w-2 shrink-0 items-center justify-center"
				>
					<div
						class="absolute inset-0 inline-flex shrink-0 animate-ping rounded-full bg-success opacity-75"
					/>
					<Dot
						class="relative inline-flex h-2 w-2 text-success"
						style="stroke-width: 16"
						aria-hidden="true"
						focusable="false"
					/>
					<span class="sr-only">Current Tab</span>
				</div>
			{/if}
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
						aria-label="More Options"
						class="h-6 w-6"
						on:click={(event) => event.stopPropagation()}
					>
						<MoreVertical class="h-4 w-4" />
						<span class="sr-only">More Options</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="top" class="select-none">
					<span>More</span>
				</Tooltip.Content>
			</Tooltip.Root>
		</DropdownMenuRequestOptions>
	</div>
</Button>
