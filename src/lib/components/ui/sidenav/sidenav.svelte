<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' };

	let className: $$Props['class'] = undefined;
	export let orientation: $$Props['orientation'] = 'horizontal';
	export { className as class };
</script>

<div
	class={cn('flex h-full flex-1 data-[orientation=vertical]:flex-col', className)}
	data-orientation={orientation}
	{...$$restProps}
>
	<slot />
</div>
