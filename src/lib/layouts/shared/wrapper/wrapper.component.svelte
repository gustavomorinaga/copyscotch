<script lang="ts" context="module">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/ui';
</script>

<script lang="ts">
	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div class={cn('flex h-[100svh] w-screen flex-col', className)} {...$$restProps}>
	<slot />
</div>
