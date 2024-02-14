<script lang="ts">
	import { onNavigate } from '$app/navigation';

	type $$Props = { name?: string };

	export let name: $$Props['name'] = 'root';

	onNavigate((navigation) => {
		//@ts-expect-error
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			//@ts-expect-error
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<slot style="--view-transition-name: {name}" />

<style lang="postcss" global>
	::view-transition-old(var(--view-transition-name)),
	::view-transition-new(var(--view-transition-name)) {
		animation-duration: 150ms;
		animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	@media (prefers-reduced-motion) {
		::view-transition-group(var(--view-transition-name)),
		::view-transition-old(var(--view-transition-name)),
		::view-transition-new(var(--view-transition-name)) {
			animation: none !important;
		}
	}
</style>
