<script lang="ts">
	import { Center } from '$lib/components/ui/center';
	import { cn } from '$lib/utils';
	import { Loader } from 'lucide-svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type $$Props = HTMLAttributes<HTMLElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<Center>
	<Loader class={cn('h-4 w-4 animate-spin', className)} {...$$restProps} />
</Center>
