<script lang="ts" context="module">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { X } from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';
</script>

<script lang="ts">
	type $$Props = ComponentProps<Input>;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'] = undefined;
	export { className as class };
</script>

<div class="relative inline-flex w-full flex-1 items-center">
	<Input
		class={cn(
			'peer/search h-8 border-none bg-transparent py-2 pl-4 pr-8 text-sm focus-visible:z-10',
			className
		)}
		type="search"
		placeholder="Search"
		autocomplete="off"
		bind:value
		on:blur
		on:change
		on:click
		on:focus
		on:keydown
		on:keypress
		on:keyup
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:paste
		on:input
		{...$$restProps}
	/>

	<Button
		size="icon"
		variant="text"
		class="absolute inset-y-auto right-2 h-6 w-6 peer-focus-visible/search:z-20 disabled:invisible"
		disabled={!value}
		on:click={() => (value = '')}
	>
		<X class="h-4 w-4" />
		<span class="sr-only">Clean</span>
	</Button>
</div>
