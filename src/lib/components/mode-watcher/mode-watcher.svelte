<script lang="ts">
	import { onMount } from 'svelte';
	import {
		mode,
		localStorageKey,
		setMode,
		setInitialMode,
		systemPrefersMode,
		themeColors as themeColorsStore
	} from './mode';
	import { isValidMode } from './stores';
	import type { Mode, ThemeColors } from './types';
	import type { TSettingsInfer } from '$lib/validators';

	export let track = true;
	export let defaultMode: Mode = 'system';
	export let themeColors: ThemeColors = undefined;

	themeColorsStore.set(themeColors);

	onMount(() => {
		const unsubscriber = mode.subscribe(() => {});
		systemPrefersMode.tracking(track);
		systemPrefersMode.query();
		const stored = JSON.parse(localStorage.getItem(localStorageKey) as string) as TSettingsInfer;
		setMode(isValidMode(stored.backgroundColor) ? stored.backgroundColor : defaultMode);

		return () => {
			unsubscriber();
		};
	});

	const args = `"${defaultMode}"${themeColors ? `, ${JSON.stringify(themeColors)}` : ''}`;
</script>

<svelte:head>
	{#if themeColors}
		<!-- default to dark mode for to allow testing -->
		<!-- this will be overwritten by FOUC prevention snippet below -->
		<!-- but that snippet does not run in vitest -->
		<meta name="theme-color" content={themeColors.dark} />
	{/if}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<script nonce="%sveltekit.nonce%">(` +
		setInitialMode.toString() +
		`)(` +
		args +
		`);</script>`}
</svelte:head>
