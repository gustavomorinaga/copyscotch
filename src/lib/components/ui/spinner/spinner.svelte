<script lang="ts">
	import Loader from 'lucide-svelte/icons/loader';
	import type { HTMLAttributes } from 'svelte/elements';
	import { Center } from '$lib/components/ui/center';
	import { cn } from '$lib/utils';

	type $$Props = HTMLAttributes<HTMLElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<Center>
	<Loader class={cn('h-4 w-4 shrink-0 animate-spin', className)} {...$$restProps} />
</Center>
