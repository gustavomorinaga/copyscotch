<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' };

	let className: $$Props['class'] = undefined;
	export let orientation: $$Props['orientation'] = 'horizontal';
	export { className as class };
</script>

<div
	class={cn('flex h-full flex-1 aria-[orientation=vertical]:flex-col', className)}
	aria-orientation={orientation}
	{...$$restProps}
>
	<slot />
</div>
