<script lang="ts">
	import { Toaster as Sonner, type ToasterProps as SonnerProps } from 'svelte-sonner';
	import { mode } from '$lib/components/mode-watcher';

	type $$Props = SonnerProps;

	$: theme = $mode as any;
</script>

<Sonner
	{theme}
	class="toaster group"
	style="--normal-border: hsl(var(--border) / var(--tw-border-opacity)) !important;"
	toastOptions={{
		classes: {
			toast:
				'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
			description: 'group-[.toast]:text-muted-foreground',
			actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
			cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground'
		}
	}}
	{...$$restProps}
/>
