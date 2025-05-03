<script lang="ts" module>
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/ui';
</script>

<script lang="ts">
	type $$Props = HTMLAttributes<HTMLDivElement>;

	interface Props {
		class?: $$Props['class'];
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { class: className = undefined, children, ...rest }: Props = $props();
	
</script>

<div class={cn('flex h-[100svh] w-screen flex-col', className)} {...rest}>
	{@render children?.()}
</div>
