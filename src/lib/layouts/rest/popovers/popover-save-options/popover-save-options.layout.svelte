<script lang="ts" context="module">
	import { getRESTTabStore } from '$lib/stores';
	import * as Popover from '$lib/components/ui/popover';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { FolderPlus } from 'lucide-svelte';
	import type { TRESTTabInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id'] };

	export let tabID: $$Props['tabID'];

	const tabStore = getRESTTabStore();

	$: tab = tabStore.get(tabID) as TRESTTabInfer;

	// TODO - Add name validation using superforms

	function handleOnInput(event: InputEvent) {
		const name = (event.target as HTMLInputElement).value.trim();
		tabStore.setDirty([tabID], true);
		tabStore.update(tabID, { name });
	}
</script>

<Popover.Root>
	<Popover.Trigger asChild let:builder>
		<slot {builder} />
	</Popover.Trigger>
	<Popover.Content sideOffset={8} class="w-80 bg-background">
		<div class="flex flex-col gap-2">
			<Input
				type="text"
				autocomplete="off"
				class="bg-input"
				value={tab.context.name}
				on:input={handleOnInput}
			/>

			<Button size="sm" variant="ghost">
				<FolderPlus class="mr-2 h-4 w-4" />
				Save As
			</Button>
		</div>
	</Popover.Content>
</Popover.Root>
