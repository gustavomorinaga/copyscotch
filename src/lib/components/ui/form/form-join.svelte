<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/ui';

	type $$Props = HTMLAttributes<HTMLDivElement>;
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<div class={cn('inline-flex flex-1', className)} {...$$restProps}>
	<slot />
</div>
