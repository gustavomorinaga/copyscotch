<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils';

	type $$Props = HTMLAttributes<HTMLFormElement> & Pick<HTMLFormElement, 'action'>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<form class={cn('flex w-full flex-1 flex-col', className)} {...$$restProps}>
	<slot />
</form>
