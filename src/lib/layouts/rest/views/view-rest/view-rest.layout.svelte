<script lang="ts" context="module">
	import { ViewEdit } from '$lib/layouts';
	import type { TRESTRequestSchema } from '$lib/validators';
	import type { SuperValidated } from 'sveltekit-superforms';
</script>

<script lang="ts">
	type $$Props = { form: SuperValidated<TRESTRequestSchema> };

	export let form: $$Props['form'];
</script>

<ViewEdit {form} />
