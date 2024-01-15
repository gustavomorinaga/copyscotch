<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div
	class={cn('my-auto flex h-full flex-col items-center justify-center gap-2', className)}
	{...$$restProps}
>
	<slot />
</div>
