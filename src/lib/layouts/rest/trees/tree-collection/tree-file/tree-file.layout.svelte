<script lang="ts" context="module">
	import { getRESTTabStore } from '$lib/stores';
	import { DropdownMenuRequestOptions } from '$lib/layouts/rest';
	import { Button } from '$lib/components/ui/button';
	import { MoreVertical } from 'lucide-svelte';
	import type { TRESTRequestInfer } from '$lib/validators';
</script>

<script lang="ts">
	import { Dot } from 'lucide-svelte';

	type $$Props = { file: TRESTRequestInfer };

	export let file: $$Props['file'];
	let openOptions: boolean = false;

	const tabStore = getRESTTabStore();

	$: current = $tabStore.current === file.id;
</script>

<Button
	size="sm"
	variant="text"
	class="group/file w-full flex-1 px-0"
	on:click={(event) => {
		event.stopPropagation();
		tabStore.get(file.id) ? tabStore.setCurrent(file.id) : tabStore.add(file);
	}}
>
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
			{#if current}
				<div class="relative mx-3 flex h-2 w-2 flex-shrink-0 items-center justify-center">
					<div
						class="absolute inset-0 inline-flex flex-shrink-0 animate-ping rounded-full bg-success opacity-75"
					/>
					<Dot
						class="relative inline-flex h-2 w-2 text-success"
						style="stroke-width: 16"
						aria-hidden="true"
						focusable="false"
					/>
				</div>
			{/if}
		</span>
	</div>

	<div class="flex items-center">
		<DropdownMenuRequestOptions request={file} bind:open={openOptions} let:builder>
			<Button
				builders={[builder]}
				size="icon"
				variant="text"
				class="h-6 w-6"
				on:click={(event) => event.stopPropagation()}
			>
				<MoreVertical class="h-4 w-4" />
				<span class="sr-only">More options</span>
			</Button>
		</DropdownMenuRequestOptions>
	</div>
</Button>
