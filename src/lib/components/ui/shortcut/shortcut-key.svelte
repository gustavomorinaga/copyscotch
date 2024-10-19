<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/ui';

	type $$Props = HTMLAttributes<HTMLSpanElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<kbd
	class={cn(
		'inline-flex min-h-5 min-w-5 items-center justify-center rounded-md border border-border bg-muted px-0.5 font-sans text-xs capitalize shadow',
		className
	)}
	{...$$restProps}
>
	<slot />
</kbd>
