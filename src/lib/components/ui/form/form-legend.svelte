<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLLegendElement>;
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<div class={cn('mb-2 text-lg font-semibold', className)} {...$$restProps}>
	<slot />
</div>
