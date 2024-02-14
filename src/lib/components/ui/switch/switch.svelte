<script lang="ts">
	import { Switch as SwitchPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils';

	type $$Props = SwitchPrimitive.Props;

	let className: $$Props['class'] = undefined;
	export let checked: $$Props['checked'] = undefined;
	export { className as class };
</script>

<SwitchPrimitive.Root
	bind:checked
	class={cn(
		'peer inline-flex h-[14px] w-[30px] shrink-0 cursor-pointer items-center rounded-full border-2 border-border px-0.5 transition-colors data-[state=checked]:border-accent hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50',
		className
	)}
	{...$$restProps}
>
	<SwitchPrimitive.Thumb
		class={cn(
			'pointer-events-none block h-2 w-2 rounded-full bg-muted-foreground shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[16px] data-[state=unchecked]:translate-x-0 data-[state=checked]:bg-primary'
		)}
	/>
</SwitchPrimitive.Root>
