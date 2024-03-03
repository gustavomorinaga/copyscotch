<script lang="ts">
	import { cn } from '$lib/utils';
	import { badgeVariants, type Variant, type Size } from '.';

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
