<script lang="ts">
	import { screenStore } from '.';

	let innerWidth: number = $state(0);
	let innerHeight: number = $state(0);

	run(() => {
		screenStore.set({ innerWidth, innerHeight });
	});
</script>

<svelte:window bind:innerWidth bind:innerHeight />
