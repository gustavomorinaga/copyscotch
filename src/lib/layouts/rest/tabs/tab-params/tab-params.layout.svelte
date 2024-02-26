<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { FeedbackParametersEmpty } from '$lib/layouts/rest';
	import type { TKeyValueInfer, TRESTRequestInfer } from '$lib/validators';
	import type { SuperForm } from 'sveltekit-superforms';

	const DEFAULT_KEY_VALUE: TKeyValueInfer = {
		key: '',
		value: '',
		active: true
	};
</script>

<script lang="ts">
	type $$Props = { form: SuperForm<TRESTRequestInfer> };

	export let form: $$Props['form'];

	$: ({ form: formValue } = form);
	$: hasParams = $formValue.params.length > 0;

	onMount(() => {
		if (!hasParams) $formValue.params.push(DEFAULT_KEY_VALUE);
	});
</script>

{#if !hasParams}
	<FeedbackParametersEmpty />
{/if}
