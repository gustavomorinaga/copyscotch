<script lang="ts">
	import { screenStore } from '.';

	let innerWidth: number = 0;
	let innerHeight: number = 0;

	$: screenStore.set({ innerWidth, innerHeight });
</script>

<svelte:window bind:innerWidth bind:innerHeight />
