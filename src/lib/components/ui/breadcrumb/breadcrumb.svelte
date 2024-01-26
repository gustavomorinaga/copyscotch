<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div
	class={cn(
		'inline-flex items-center gap-2 overflow-x-auto whitespace-nowrap px-4 py-2 text-xs text-muted-foreground',
		className
	)}
	{...$$restProps}
>
	<slot />
</div>
