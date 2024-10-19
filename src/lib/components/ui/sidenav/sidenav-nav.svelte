<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/ui';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<aside class={cn('flex h-full w-fit shrink-0 flex-col', className)} {...$$restProps}>
	<slot />
</aside>
