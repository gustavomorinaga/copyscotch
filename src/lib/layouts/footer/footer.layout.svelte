<script lang="ts" context="module">
	import { getSettingsStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Columns, Rows, PanelLeftClose, PanelLeftOpen } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import type { TSettingsInfer } from '$lib/validators';

	type TSettingOption = { icon: ComponentType; label: string };

	const MOBILE_BREAKPOINT = 640;
	const LAYOUT: Record<TSettingsInfer['layout'], TSettingOption> = {
		horizontal: {
			icon: Columns,
			label: 'Switch to horizontal layout'
		},
		vertical: {
			icon: Rows,
			label: 'Switch to vertical layout'
		}
	};
	const SIDEBAR: Record<TSettingsInfer['sidebar'], TSettingOption> = {
		open: {
			icon: PanelLeftClose,
			label: 'Hide sidebar'
		},
		closed: {
			icon: PanelLeftOpen,
			label: 'Show sidebar'
		}
	} as const;
</script>

<script lang="ts">
	const settingsStore = getSettingsStore();

	$: layoutProps = LAYOUT[$settingsStore.layout];
	$: sidebarProps = SIDEBAR[$settingsStore.sidebar];
	$: innerWidth = 0;
	$: isMobile = innerWidth < MOBILE_BREAKPOINT;
	$: {
		$settingsStore.sidebar = isMobile ? 'closed' : 'open';
	}

	function handleLayoutToggle() {
		$settingsStore.layout = $settingsStore.layout === 'horizontal' ? 'vertical' : 'horizontal';
	}

	function handleSidebarToggle() {
		$settingsStore.sidebar = $settingsStore.sidebar === 'open' ? 'closed' : 'open';
	}
</script>

<svelte:window bind:innerWidth />

{#if !isMobile}
	<Separator orientation="horizontal" />

	<footer
		class="flex h-8 w-full items-center justify-end overflow-x-auto overflow-y-hidden bg-background"
	>
		<Button size="icon" variant="text" class="h-8 w-8" on:click={handleLayoutToggle}>
			<svelte:component this={layoutProps.icon} class="h-5 w-5" />
			<span class="sr-only">{layoutProps.label}</span>
		</Button>

		<Button size="icon" variant="text" class="h-8 w-8" on:click={handleSidebarToggle}>
			<svelte:component this={sidebarProps.icon} class="h-5 w-5" />
			<span class="sr-only">{sidebarProps.label}</span>
		</Button>
	</footer>
{/if}
