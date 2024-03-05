<script lang="ts" context="module">
	import { getSettingsContext } from '$lib/contexts';
	import { BREAKPOINTS } from '$lib/maps';
	import { screenStore } from '$lib/components/screen-watcher';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Columns from 'lucide-svelte/icons/columns-2';
	import Rows from 'lucide-svelte/icons/rows-2';
	import PanelLeft from 'lucide-svelte/icons/panel-left';
	import PanelLeftClose from 'lucide-svelte/icons/panel-left-close';
	import PanelLeftOpen from 'lucide-svelte/icons/panel-left-open';
	import PanelRight from 'lucide-svelte/icons/panel-right';
	import PanelRightClose from 'lucide-svelte/icons/panel-right-close';
	import PanelRightOpen from 'lucide-svelte/icons/panel-right-open';
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
	const NAVIGATION: Record<TSettingsInfer['navigation'], TSettingOption> = {
		collapse: {
			icon: PanelRight,
			title: 'Expand Navbar',
			tooltip: 'Expand Navbar'
		},
		expand: {
			icon: PanelLeft,
			title: 'Collapse Navbar',
			tooltip: 'Collapse Navbar'
		}
	};
	const SIDEBAR: Record<
		TSettingsInfer['sidebar'],
		Record<TSettingsInfer['sidebarPosition'], TSettingOption>
	> = {
		open: {
			left: {
				icon: PanelLeftClose,
				title: 'Hide Sidebar',
				tooltip: 'Hide Sidebar'
			},
			right: {
				icon: PanelRightClose,
				title: 'Hide Sidebar',
				tooltip: 'Hide Sidebar'
			}
		},
		closed: {
			left: {
				icon: PanelLeftOpen,
				title: 'Show Sidebar',
				tooltip: 'Show Sidebar'
			},
			right: {
				icon: PanelRightOpen,
				title: 'Show Sidebar',
				tooltip: 'Show Sidebar'
			}
		}
	} as const;
</script>

<script lang="ts">
	const settingsContext = getSettingsContext();

	$: ({ layout, navigation, sidebar, sidebarPosition } = $settingsContext);
	$: layoutProps = LAYOUT[layout];
	$: navigationProps = NAVIGATION[navigation];
	$: sidebarProps = SIDEBAR[sidebar][sidebarPosition];
	$: isMobile = $screenStore.innerWidth < BREAKPOINTS.sm;

	function handleLayoutToggle() {
		$settingsContext.layout = $settingsContext.layout === 'horizontal' ? 'vertical' : 'horizontal';
	}

	function handleNavigationToggle() {
		$settingsContext.navigation =
			$settingsContext.navigation === 'collapse' ? 'expand' : 'collapse';
	}

	function handleSidebarToggle() {
		$settingsContext.sidebar = $settingsContext.sidebar === 'open' ? 'closed' : 'open';
	}
</script>

{#if !isMobile}
	<Separator orientation="horizontal" />

	<footer
		class="flex h-8 w-full shrink-0 items-center justify-between overflow-x-auto overflow-y-hidden bg-background"
	>
		<div class="flex">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						size="icon"
						variant="text"
						aria-label={navigationProps.title}
						class="h-8 w-8"
						on:click={handleNavigationToggle}
					>
						<svelte:component this={navigationProps.icon} class="h-5 w-5 shrink-0" />
						<span class="sr-only select-none">{navigationProps.title}</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="top" class="select-none">
					<span>{navigationProps.tooltip}</span>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>

		<div class="flex">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						size="icon"
						variant="text"
						aria-label={layoutProps.title}
						class="h-8 w-8"
						on:click={handleLayoutToggle}
					>
						<svelte:component this={layoutProps.icon} class="h-5 w-5 shrink-0" />
						<span class="sr-only select-none">{layoutProps.title}</span>
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
						aria-label={sidebarProps.title}
						class="h-8 w-8"
						on:click={handleSidebarToggle}
					>
						<svelte:component this={sidebarProps.icon} class="h-5 w-5 shrink-0" />
						<span class="sr-only select-none">{sidebarProps.title}</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="top" class="select-none">
					<span>{sidebarProps.tooltip}</span>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	</footer>
{/if}
