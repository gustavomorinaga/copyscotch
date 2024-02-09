<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { Separator } from '$lib/components/ui/separator';
</script>

<script lang="ts">
	type $$Props = { open?: boolean };

	export let open: $$Props['open'] = false;
	let el: HTMLDivElement;

	function handleCollapse(event: MouseEvent) {
		event.stopPropagation();
		open = false;
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
