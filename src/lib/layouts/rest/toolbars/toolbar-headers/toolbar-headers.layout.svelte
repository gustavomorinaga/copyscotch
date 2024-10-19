<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import Plus from 'lucide-svelte/icons/plus';
	import Trash2 from 'lucide-svelte/icons/trash-2';
	import type { SuperForm } from 'sveltekit-superforms';
	import { getRESTTabContext } from '$lib/contexts';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { DEFAULT_HEADER, type TRESTRequestInfer, type TRESTTabInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id']; form: SuperForm<TRESTRequestInfer> };

	export let tabID: $$Props['tabID'];
	export let form: $$Props['form'];

	const tabContext = getRESTTabContext();

	let toolbarRef!: HTMLElement;

	$: ({ form: formData } = form);

	function handleClearAll() {
		$formData.headers.length = 0;
	}

	function handleAddNew() {
		tabContext.updateTab(tabID, { headers: [...$formData.headers, DEFAULT_HEADER] });
	}

	onMount(() => {
		toolbarRef = document.getElementById('main-request-toolbar') as HTMLElement;
	});
</script>

<div
	class="sticky z-10 flex h-10 shrink-0 flex-col bg-background lg:top-[6.825rem] {toolbarRef?.offsetHeight >
	100
		? 'top-[9.825rem]'
		: 'top-[6.825rem]'}"
>
	<div
		class="flex w-full flex-1 items-center justify-between overflow-x-auto overflow-y-hidden pl-4"
	>
		<div class="flex">
			<span class="select-none truncate text-sm font-semibold text-muted-foreground">
				Header List
			</span>
		</div>

		<div class="flex">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						size="icon"
						variant="text"
						aria-label="Clear All Headers"
						on:click={handleClearAll}
					>
						<Trash2 class="h-4 w-4 shrink-0" />
						<span class="sr-only select-none">Clear All</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="top" class="select-none">
					<span>Clear All</span>
				</Tooltip.Content>
			</Tooltip.Root>

			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						size="icon"
						variant="text"
						aria-label="Add New Header"
						on:click={handleAddNew}
					>
						<Plus class="h-4 w-4 shrink-0" />
						<span class="sr-only select-none">Add New</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="top" class="select-none">
					<span>Add New</span>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	</div>

	<Separator orientation="horizontal" />
</div>
