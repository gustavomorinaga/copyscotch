<script lang="ts" module>
	import LifeBuoy from 'lucide-svelte/icons/life-buoy';
	// import UploadCloud from 'lucide-svelte/icons/upload-cloud';
	import { page } from '$app/stores';
	import { DialogSupport } from '$lib/features/support/components/dialogs/dialog-support';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tooltip from '$lib/components/ui/tooltip';
</script>

<script lang="ts">
	let isRootPage = $derived($page.url.pathname === '/');
</script>

<header
	class="grid h-14 shrink-0 grid-cols-5 grid-rows-1 gap-2 overflow-x-auto overflow-y-hidden bg-background p-2"
>
	<div class="col-span-3 flex items-center justify-between gap-x-2">
		<Button
			size="sm"
			variant="ghost"
			href="/"
			aria-label="Go to Home Page"
			aria-current={isRootPage ? 'page' : undefined}
			class="font-bold uppercase"
		>
			<span class="select-none">Copyscotch</span>
		</Button>
	</div>

	<div class="col-span-2 flex items-center justify-between gap-x-2">
		<div class="ml-auto">
			<DialogSupport >
				{#snippet children({ builder: triggerBuilder })}
								<Tooltip.Root>
						<Tooltip.Trigger asChild >
							{#snippet children({ builder: tooltipBuilder })}
												<Button
									builders={[triggerBuilder, tooltipBuilder]}
									size="icon"
									variant="ghost"
									aria-label="Support Options"
								>
									<LifeBuoy class="h-5 w-5 shrink-0" />
									<span class="sr-only select-none">Support</span>
								</Button>
																		{/snippet}
										</Tooltip.Trigger>
						<Tooltip.Content side="bottom" class="select-none">
							<span>Support</span>
						</Tooltip.Content>
					</Tooltip.Root>
											{/snippet}
						</DialogSupport>
		</div>
	</div>

	<!-- <div class="col-span-2 flex items-center justify-between gap-x-2">
		<Button size="sm" variant="success" aria-label="Save My Workspace" class="ml-auto" disabled>
			<UploadCloud class="w-4 h-4 mr-2 shrink-0" />
			<span class="select-none">Save My Workspace</span>
		</Button>
	</div> -->
</header>

<Separator orientation="horizontal" />
