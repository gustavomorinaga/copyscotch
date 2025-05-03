<script>
	/**
	 * @typedef {Object} Props
	 * @property {import('svelte').Snippet} [children]
	 */

	/** @type {Props} */
	let { children } = $props();
</script>

<script lang="ts" module>
	import '$lib/styles/app.pcss';
	import { siteConfig as config } from '$lib/configs/site';
	import { ServiceWorker } from '$lib/components/service-worker';
	import { Metadata } from '$lib/components/metadata';
	import { ModeWatcher } from '$lib/components/mode-watcher';
	import { ScreenWatcher } from '$lib/components/screen-watcher';
	import { ViewTransition } from '$lib/components/view-transition';
	import { Toaster } from '$lib/components/ui/sonner';
	import { AppLayout } from '$lib/layouts/app';
</script>

<ServiceWorker />
<Metadata {config} />
<ModeWatcher />
<ScreenWatcher />
<ViewTransition />
<Toaster position="bottom-center" offset={40} />
<AppLayout>
	{@render children?.()}
</AppLayout>
