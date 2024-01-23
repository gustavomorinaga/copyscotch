<script lang="ts" context="module">
	import { getRESTTabStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { MoreVertical, Trash2 } from 'lucide-svelte';
	import type { TRESTRequestInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { file: TRESTRequestInfer };

	export let file: $$Props['file'];

	const tabStore = getRESTTabStore();
</script>

<Button
	size="sm"
	variant="text"
	class="w-full flex-1 px-0"
	on:click={(event) => {
		event.stopPropagation();
		if (!tabStore.get(file.id)) tabStore.add(file);
	}}
>
	<div class="flex flex-1 items-center justify-center">
		<span
			class="pointer-events-none flex w-16 items-center justify-center truncate px-2 text-tiny"
			style="color: var(--method-{file.method.toLowerCase()}-color)"
		>
			{file.method}
		</span>
		<span class="flex flex-1 py-2 pr-2">
			<span class="truncate text-sm">{file.name}</span>
		</span>
	</div>

	<div class="flex items-center">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger let:builder>
				<Button
					builders={[builder]}
					size="icon"
					variant="ghost"
					class="h-6 w-6 text-accent-foreground"
					on:click={(event) => event.stopPropagation()}
				>
					<MoreVertical class="h-4 w-4" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Item>
					<Trash2 class="mr-2 h-4 w-4" />
					Delete
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</Button>
