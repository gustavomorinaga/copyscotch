<script lang="ts" context="module">
	import { Button } from '$lib/components/ui/button';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { Folder, FolderOpen, MoreVertical } from 'lucide-svelte';
	import type { TRESTCollectionInfer } from '$lib/validators';
</script>

<script lang="ts">
	type $$Props = { folders: Array<TRESTCollectionInfer> };

	export let folders: $$Props['folders'] = [];
</script>

<ul class="flex flex-col">
	{#each folders as folder}
		<li>
			<Collapsible.Root class="flex flex-col">
				<Collapsible.Trigger class="inline-flex items-center">
					<div class="flex flex-1 items-center justify-center">
						{#if false}
							<FolderOpen class="mx-2 h-5 w-5" />
						{:else}
							<Folder class="mx-2 h-5 w-5" />
						{/if}
						<span class="flex flex-1 py-2 pr-2">
							<span class="truncate text-sm">{folder.name}</span>
						</span>
					</div>
					<div class="flex items-center">
						<Button
							size="icon"
							variant="ghost"
							class="h-6 w-6"
							on:click={(event) => event.stopPropagation()}
						>
							<MoreVertical class="h-4 w-4" />
						</Button>
					</div>
				</Collapsible.Trigger>
				<Collapsible.Content class="flex">
					<div
						class="ml-[1.175rem] flex w-0.5 transform bg-accent transition hover:scale-x-125 hover:bg-muted-foreground"
					/>

					<ul class="flex flex-1 flex-col">
						{#if folder.folders.length}
							<svelte:self folders={folder.folders} />
						{/if}

						{#each folder.requests as request}
							{@const methodLowCase = request.method.toLowerCase()}

							<li class="flex-1">
								<Button size="sm" variant="text" class="w-full flex-1 px-0">
									<div class="flex flex-1 items-center justify-center">
										<span
											class="pointer-events-none flex w-16 items-center justify-center truncate px-2 text-tiny"
											style="color: var(--method-{methodLowCase}-color)"
										>
											{request.method}
										</span>
										<span class="flex flex-1 py-2 pr-2">
											<span class="truncate text-sm">{request.name}</span>
										</span>
									</div>
									<div class="flex items-center">
										<Button
											size="icon"
											variant="ghost"
											class="h-6 w-6 text-accent-foreground"
											on:click={(event) => event.stopPropagation()}
										>
											<MoreVertical class="h-4 w-4" />
										</Button>
									</div>
								</Button>
							</li>
						{/each}
					</ul>
				</Collapsible.Content>
			</Collapsible.Root>
		</li>
	{/each}
</ul>
