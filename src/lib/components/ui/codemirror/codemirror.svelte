<script lang="ts">
	import CodeMirror from 'svelte-codemirror-editor';
	import { cn } from '$lib/utils';
	import { langs, theme } from '.';
	import type { ComponentProps } from 'svelte';

	type $$Props = Omit<ComponentProps<CodeMirror>, 'lang'> & { lang?: keyof typeof langs };

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'] = undefined;
	export let lang: $$Props['lang'] = undefined;
	export { className as class };
</script>

<CodeMirror
	class={cn('flex h-full w-full flex-1 flex-col', className)}
	lang={lang && langs[lang]()}
	styles={theme}
	{...$$restProps}
	bind:value
/>
