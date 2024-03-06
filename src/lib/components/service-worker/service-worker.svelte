<script lang="ts">
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';

	async function detectSWUpdate() {
		const registration = await navigator.serviceWorker.ready;

		registration.addEventListener('updatefound', () => {
			const newSW = registration.installing;
			newSW?.addEventListener('statechange', () => {
				if (newSW?.state === 'installed') {
					toast('New version found! Refresh to update?', {
						important: true,
						duration: Number.POSITIVE_INFINITY,
						action: {
							label: 'Refresh',
							onClick: () => {
								newSW.postMessage({ type: 'SKIP_WAITING' });
								window.location.reload();
							}
						},
						cancel: {
							label: 'Later'
						}
					});
				}
			});
		});
	}

	onMount(() => {
		detectSWUpdate();
	});
</script>
