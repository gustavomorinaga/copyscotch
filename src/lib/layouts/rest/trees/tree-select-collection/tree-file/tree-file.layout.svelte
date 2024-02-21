<script lang="ts" context="module">
	import { getRESTTabContext } from '$lib/contexts';
	import { DropdownMenuRequestOptions } from '$lib/layouts/rest';
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

	// TODO - Handle selected state

	$: current = $tabContext.current === file.id;
</script>

<Button size="sm" variant="text" class="group/file w-full flex-1 px-0" on:click>
	<div
		role="button"
		tabindex="0"
		class="flex flex-1 items-center justify-center"
		on:contextmenu={(event) => {
			event.preventDefault();
			openOptions = true;
		}}
	>
		<span
			class="pointer-events-none flex w-16 items-center justify-center truncate px-2 text-tiny"
			style="color: var(--method-{file.method.toLowerCase()}-color)"
		>
			{file.method}
		</span>
		<span class="flex flex-1 items-center py-2 pr-2">
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
