<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import CodeMirror from 'svelte-codemirror-editor';
	import { type Langs, langs, theme } from '.';
	import { cn } from '$lib/utils/ui';

	type $$Props = Omit<ComponentProps<CodeMirror>, 'lang'> & { lang?: Langs };

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'] = undefined;
	export let lang: $$Props['lang'] = undefined;
	export { className as class };
</script>

<CodeMirror
	class={cn('flex h-full w-full flex-1 flex-col', className)}
	lang={lang ? langs[lang]() : undefined}
	styles={theme}
	{...$$restProps}
	bind:value
/>
