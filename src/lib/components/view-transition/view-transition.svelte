<script lang="ts">
	import { onNavigate } from '$app/navigation';

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

<style lang="postcss" global>
	::view-transition-old(root),
	::view-transition-new(root) {
		animation-duration: 150ms;
		animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	@media (prefers-reduced-motion) {
		::view-transition-group(root),
		::view-transition-old(root),
		::view-transition-new(root) {
			animation: none !important;
		}
	}
</style>
