<script lang="ts" context="module">
	import { getSettingsStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { BREAKPOINTS } from '$lib/maps';
	import { Columns, Rows, PanelLeftClose, PanelLeftOpen } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import type { TSettingsInfer } from '$lib/validators';

	type TSettingOption = { icon: ComponentType; title: string; tooltip?: string };

	const LAYOUT: Record<TSettingsInfer['layout'], TSettingOption> = {
		horizontal: {
			icon: Rows,
			title: 'Switch to vertical layout',
			tooltip: 'Vertical Layout'
		},
		vertical: {
			icon: Columns,
			title: 'Switch to horizontal layout',
			tooltip: 'Horizontal Layout'
		}
	};
	const SIDEBAR: Record<TSettingsInfer['sidebar'], TSettingOption> = {
		open: {
			icon: PanelLeftClose,
			title: 'Hide sidebar',
			tooltip: 'Hide Sidebar'
		},
		closed: {
			icon: PanelLeftOpen,
			title: 'Show sidebar',
			tooltip: 'Show Sidebar'
		}
	} as const;
</script>

<script lang="ts">
	const settingsStore = getSettingsStore();

	$: layoutProps = LAYOUT[$settingsStore.layout];
	$: sidebarProps = SIDEBAR[$settingsStore.sidebar];
	$: innerWidth = 0;
	$: isMobile = innerWidth < BREAKPOINTS.sm;
	$: if (isMobile) $settingsStore.layout = 'vertical';
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
		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					size="icon"
					variant="text"
					class="h-8 w-8"
					on:click={handleLayoutToggle}
				>
					<svelte:component this={layoutProps.icon} class="h-5 w-5" />
					<span class="sr-only">{layoutProps.title}</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="top" class="select-none">
				<span>{layoutProps.tooltip}</span>
			</Tooltip.Content>
		</Tooltip.Root>

		<Tooltip.Root>
			<Tooltip.Trigger asChild let:builder>
				<Button
					builders={[builder]}
					size="icon"
					variant="text"
					class="h-8 w-8"
					on:click={handleSidebarToggle}
				>
					<svelte:component this={sidebarProps.icon} class="h-5 w-5" />
					<span class="sr-only">{sidebarProps.title}</span>
				</Button>
			</Tooltip.Trigger>
			<Tooltip.Content side="top" class="select-none">
				<span>{sidebarProps.tooltip}</span>
			</Tooltip.Content>
		</Tooltip.Root>
	</footer>
{/if}
