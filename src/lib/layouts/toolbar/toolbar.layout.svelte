<script lang="ts" context="module">
	import { page } from '$app/stores';
	import { DialogOptions } from '$lib/layouts';
	import { Button } from '$lib/components/ui/button';
	// import { UploadCloud } from 'lucide-svelte';
</script>

<script lang="ts">
	$: isRootPage = $page.url.pathname === '/';
</script>

<header
	class="grid h-14 grid-cols-5 grid-rows-1 gap-2 overflow-x-auto overflow-y-hidden bg-background p-2"
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
			<DialogOptions />
		</div>
	</div>

	<!-- <div class="col-span-2 flex items-center justify-between gap-x-2">
		<Button size="sm" variant="success" class="ml-auto" disabled>
			<UploadCloud class="w-4 h-4 mr-2" />
			Save my workspace
		</Button>
	</div> -->
</header>
