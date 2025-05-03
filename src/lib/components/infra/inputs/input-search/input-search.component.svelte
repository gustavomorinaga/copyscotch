<script lang="ts" module>
	import type { ComponentProps } from 'svelte';
	import X from 'lucide-svelte/icons/x';
	import { debounce } from '$lib/utils/debounce';
	import { cn } from '$lib/utils/ui';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
</script>

<script lang="ts">
	type $$Props = ComponentProps<Input>;

	interface Props {
		class?: $$Props['class'];
		value?: $$Props['value'];
		[key: string]: any
	}

	let { class: className = undefined, value = $bindable(undefined), ...rest }: Props = $props();
	
</script>

<div class="relative inline-flex w-full flex-1 items-center">
	<Input
		class={cn(
			'peer/search h-[2.250rem] border-none bg-transparent py-2 pl-4 pr-[2.375rem] text-sm !ring-transparent !ring-offset-transparent',
			className
		)}
		type="search"
		placeholder="Search"
		autocomplete="off"
		{value}
		on:blur
		on:change
		on:click
		on:focus
		on:keydown
		on:keypress
		on:keyup={debounce((event) => (value = event.target.value))}
		on:mouseover
		on:mouseenter
		on:mouseleave
		on:paste
		on:input
		{...rest}
	/>

	<Button
		size="icon"
		variant="text"
		aria-label="Clean Search"
		class="absolute inset-y-auto right-2 h-6 w-6 peer-focus-visible/search:z-20 disabled:invisible"
		disabled={!value}
		on:click={() => (value = '')}
	>
		<X class="h-4 w-4 shrink-0" />
		<span class="sr-only select-none">Clean</span>
	</Button>
</div>
