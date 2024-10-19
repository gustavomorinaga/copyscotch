<script lang="ts" context="module">
	import FolderPlus from 'lucide-svelte/icons/folder-plus';
	import User from 'lucide-svelte/icons/user';
	import type { ComponentType } from 'svelte';
	import { dialogImportStore as dialogStore } from '.';
	import { getRESTContext } from '$lib/contexts/rest';
	import { exportFile } from '$lib/functions/export';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Dialog from '$lib/components/ui/dialog';

	type TView = { value: string; name: string; icon: ComponentType; view: Promise<any> };

	const VIEWS = {
		'import-from-file': {
			value: 'import-from-file',
			name: 'Import from Copyscotch',
			icon: FolderPlus,
			view: import('$lib/features/rest/views/view-import-from-file').then(
				(module) => module.ViewImportFromFile
			)
		}
	} as const satisfies Record<string, TView>;
</script>

<script lang="ts">
	const restContext = getRESTContext();

	let currentView: keyof typeof VIEWS | null = null;

	$: hasSavedCollections = $restContext?.length > 0;

	function handleOpenChange(event: boolean) {
		if (!event) currentView = null;
	}

	function handleExport() {
		if (!hasSavedCollections) return;
		const file = JSON.stringify($restContext, null, 2);
		exportFile(file, 'collections', 'application/json');
	}
</script>

<Dialog.Root
	bind:open={$dialogStore.open}
	closeOnOutsideClick={false}
	onOpenChange={handleOpenChange}
>
	<Dialog.Content class="z-[60]" overlayClass="z-[60]">
		<Dialog.Header>
			<Dialog.Title>Collections</Dialog.Title>
		</Dialog.Header>

		{#if !currentView}
			<ul role="menu" class="flex flex-col gap-2">
				{#each Object.values(VIEWS) as { name, value, icon }}
					<li class="contents">
						<Button
							variant="ghost"
							role="menuitem"
							class="w-full flex-1 justify-start"
							on:click={() => (currentView = value)}
						>
							<svelte:component this={icon} class="mr-4 h-5 w-5 shrink-0" />
							<span class="select-none">{name}</span>
						</Button>
					</li>
				{/each}

				<Separator orientation="horizontal" />

				<li class="contents">
					<Tooltip.Root>
						<Tooltip.Trigger asChild let:builder>
							<Button
								builders={[builder]}
								variant="ghost"
								role="menuitem"
								disabled={!hasSavedCollections}
								class="w-full flex-1 justify-start"
								on:click={handleExport}
							>
								<User class="mr-4 h-5 w-5 shrink-0" />
								<span class="select-none">Export as JSON</span>
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content side="top" class="select-none">
							<span>Download File</span>
						</Tooltip.Content>
					</Tooltip.Root>
				</li>
			</ul>
		{:else}
			{#await VIEWS[currentView].view then view}
				<svelte:component this={view} onCancel={() => (currentView = null)} />
			{/await}
		{/if}
	</Dialog.Content>
</Dialog.Root>
