<script lang="ts" context="module">
	import { getRESTTabStore } from '$lib/stores';
	import { ViewEdit, ViewResponse, ViewWelcome } from '$lib/layouts';
	import type { TRESTRequestSchema } from '$lib/validators';
	import type { SuperValidated } from 'sveltekit-superforms';
</script>

<script lang="ts">
	type $$Props = { form: SuperValidated<TRESTRequestSchema> };

	export let form: $$Props['form'];

	const tabStore = getRESTTabStore();
</script>

{#if $tabStore.tabs.length}
	<ViewEdit {form} />
	<ViewResponse />
{:else}
	<ViewWelcome />
{/if}
