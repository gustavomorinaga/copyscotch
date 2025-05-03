<script lang="ts" module>
	import { onMount } from 'svelte';
	import { Separator } from '$lib/components/ui/separator';
</script>

<script lang="ts">
	

	interface Props {
		onOpenChange?: (open: boolean) => void;
	}

	let { onOpenChange = undefined }: Props = $props();
	let el: HTMLDivElement = $state();

	function handleCollapse(event: MouseEvent) {
		event.stopPropagation();
		onOpenChange?.(false);
	}

	onMount(() => {
		el.addEventListener('click', handleCollapse);
		return () => {
			el.removeEventListener('click', handleCollapse);
		};
	});
</script>

<Separator
	bind:el
	orientation="vertical"
	decorative={false}
	class="ml-6 h-auto w-[2px] cursor-ns-resize hover:bg-accent"
/>
