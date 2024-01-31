<script lang="ts">
	type $$Props = { open?: boolean };

	export let open: $$Props['open'] = false;
</script>

<div
	class="ml-6 flex w-0.5 transform cursor-ns-resize bg-muted transition hover:scale-x-125 hover:bg-accent"
	role="presentation"
	aria-hidden="true"
	on:click|stopPropagation={() => (open = false)}
/>
