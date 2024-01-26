<script lang="ts">
	import { cn } from '$lib/utils';
	import { ChevronRight } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLElement> & { icon?: ComponentType };

	let className: $$Props['class'] = undefined;
	export let icon: $$Props['icon'] = ChevronRight;
	export { className as class };
</script>

<svelte:component this={icon} class={cn('h-3 w-3', className)} {...$$restProps} />
