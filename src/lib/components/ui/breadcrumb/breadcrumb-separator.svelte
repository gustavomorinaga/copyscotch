<script lang="ts">
	import type { ComponentType } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	type $$Props = HTMLAttributes<HTMLElement> & { icon?: ComponentType };

	let className: $$Props['class'] = undefined;
	export let icon: $$Props['icon'] = ChevronRight;
	export { className as class };
</script>

<svelte:component this={icon} class={cn('h-3 w-3 shrink-0', className)} {...$$restProps} />
