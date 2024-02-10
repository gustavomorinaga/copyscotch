<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLFieldSetElement>;
	let className: string | undefined | null = undefined;
	export { className as class };
</script>

<div class={cn('flex w-full flex-1 flex-col items-stretch', className)} {...$$restProps}>
	<slot />
</div>
