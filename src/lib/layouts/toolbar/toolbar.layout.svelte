<script lang="ts" context="module">
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	// import { UploadCloud } from 'lucide-svelte';
</script>

<script lang="ts">
	$: isRootPage = $page.url.pathname === '/';
</script>

<header class="toolbar">
	<div class="col-span-3">
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

	<!-- <div class="col-span-2">
		<Button size="sm" variant="success" class="ml-auto" disabled>
			<UploadCloud class="w-4 h-4 mr-2" />
			Save my workspace
		</Button>
	</div> -->
</header>

<style lang="postcss">
	header.toolbar {
		@apply grid grid-cols-5 grid-rows-1 gap-2 overflow-x-auto overflow-y-hidden p-2;
		@apply bg-background;

		& > div {
			@apply flex items-center justify-between gap-x-2;
		}
	}
</style>
