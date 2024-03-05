<script lang="ts" context="module">
	import { dialogImportStore as dialogStore } from '.';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Dialog from '$lib/components/ui/dialog';
	import FolderPlus from 'lucide-svelte/icons/folder-plus';
	import User from 'lucide-svelte/icons/user';
	import type { ComponentType } from 'svelte';

	type TView = { value: string; name: string; icon: ComponentType; view: Promise<any> };

	const VIEWS = {
		'import-from-file': {
			value: 'import-from-file',
			name: 'Import from Copyscotch',
			icon: FolderPlus,
			view: import('$lib/layouts/rest/views/view-import-from-file')
		}
	} as const satisfies Record<string, TView>;
</script>

<script lang="ts">
	let currentView: keyof typeof VIEWS | null = null;

	function handleOpenChange(event: boolean) {
		if (!event) currentView = null;
	}
</script>

<Dialog.Root
	bind:open={$dialogStore.open}
	closeOnOutsideClick={false}
	onOpenChange={handleOpenChange}
>
	<Dialog.Content>
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
							<svelte:component this={icon} class="mr-4 h-5 w-5" />
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
								class="w-full flex-1 justify-start"
							>
								<User class="mr-4 h-5 w-5" />
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
				<svelte:component this={view.default} onCancel={() => (currentView = null)} />
			{/await}
		{/if}
	</Dialog.Content>
</Dialog.Root>
