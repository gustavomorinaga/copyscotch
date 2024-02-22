<script lang="ts" context="module">
	import { page } from '$app/stores';
	import { DialogSupport } from '$lib/layouts/shared';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { LifeBuoy } from 'lucide-svelte';
	// import { UploadCloud } from 'lucide-svelte';
</script>

<script lang="ts">
	$: isRootPage = $page.url.pathname === '/';
</script>

<header
	class="grid h-14 shrink-0 grid-cols-5 grid-rows-1 gap-2 overflow-x-auto overflow-y-hidden bg-background p-2"
>
	<div class="col-span-3 flex items-center justify-between gap-x-2">
		<Button
			size="sm"
			variant="ghost"
			href="/"
			class="font-bold uppercase"
			aria-current={isRootPage ? 'page' : 'false'}
		>
			Copyscotch
		</Button>
	</div>

	<div class="col-span-2 flex items-center justify-between gap-x-2">
		<div class="ml-auto">
			<DialogSupport let:builder={triggerBuilder}>
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder={tooltipBuilder}>
						<Button builders={[triggerBuilder, tooltipBuilder]} size="icon" variant="ghost">
							<LifeBuoy class="h-5 w-5" />
							<span role="presentation" class="sr-only">Support</span>
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="bottom" class="select-none">
						<span>Support</span>
					</Tooltip.Content>
				</Tooltip.Root>
			</DialogSupport>
		</div>
	</div>

	<!-- <div class="col-span-2 flex items-center justify-between gap-x-2">
		<Button size="sm" variant="success" class="ml-auto" disabled>
			<UploadCloud class="w-4 h-4 mr-2" />
			Save my workspace
		</Button>
	</div> -->
</header>

<Separator orientation="horizontal" />
