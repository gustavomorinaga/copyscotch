<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div
	class={cn(
		'inline-flex h-[2.250rem] items-center gap-2 overflow-x-auto overflow-y-hidden whitespace-nowrap px-4 py-2 text-xs text-muted-foreground',
		className
	)}
	{...$$restProps}
>
	<slot />
</div>
