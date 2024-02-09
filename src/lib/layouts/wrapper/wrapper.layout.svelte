<script lang="ts" context="module">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';
</script>

<script lang="ts">
	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div class={cn('flex h-screen w-screen flex-col', className)} {...$$restProps}>
	<slot />
</div>
