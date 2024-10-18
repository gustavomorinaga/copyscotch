<script lang="ts">
	import { badgeVariants, type Size, type Variant } from '.';
	import { cn } from '$lib/utils';

	let className: string | undefined | null = undefined;
	export let href: string | undefined = undefined;
	export let variant: Variant = 'default';
	export let size: Size = 'default';
	export { className as class };
</script>

<svelte:element
	this={href ? 'a' : 'span'}
	{href}
	class={cn(badgeVariants({ variant, size, className }))}
	{...$$restProps}
>
	<slot />
</svelte:element>
