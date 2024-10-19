<script lang="ts">
	import { Tabs as TabsPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils/ui';

	type $$Props = TabsPrimitive.ListProps;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<TabsPrimitive.List
	class={cn(
		'inline-flex items-center rounded-md bg-muted p-1 text-muted-foreground data-[orientation=horizontal]:h-10 data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col',
		className
	)}
	{...$$restProps}
>
	<slot />
</TabsPrimitive.List>
