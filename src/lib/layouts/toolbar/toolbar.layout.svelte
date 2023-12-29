<script lang="ts" context="module">
	import { Button } from '$lib/components/ui/button';
</script>

<header class="toolbar">
	<div>
		<Button size="sm" variant="ghost" href="/" class="uppercase font-bold tracking-wider">
			Copyscotch
		</Button>
	</div>
</header>

<style lang="postcss">
	header.toolbar {
		@apply grid grid-cols-5 grid-rows-1 gap-2 overflow-x-auto overflow-y-hidden p-2;
		@apply bg-background;

		& > div {
			@apply col-span-2 flex items-center justify-between gap-x-2;
		}
	}
</style>
