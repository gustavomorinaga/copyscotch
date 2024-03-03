<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<aside class={cn('flex h-full w-fit shrink-0 flex-col', className)} {...$$restProps}>
	<slot />
</aside>
