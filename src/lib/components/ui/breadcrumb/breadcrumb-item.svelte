<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/ui';

	type $$Props = HTMLAttributes<HTMLSpanElement> & { current?: boolean };

	let className: $$Props['class'] = undefined;
	export let current: $$Props['current'] = false;
	export { className as class };
</script>

<span
	class={cn(
		'inline-flex shrink items-center justify-start truncate data-[current=true]:shrink-0 data-[current=true]:text-clip',
		className
	)}
	data-current={current}
	{...$$restProps}
>
	<slot />
</span>
