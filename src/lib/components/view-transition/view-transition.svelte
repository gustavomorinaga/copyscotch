<script lang="ts">
	import '$lib/styles/view-transition.pcss';
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
