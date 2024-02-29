<script lang="ts" context="module">
	import { getRESTTabContext } from '$lib/contexts';
	import { ToolbarBody } from '$lib/layouts/rest/toolbars/toolbar-body';
	import type { TRESTRequestInfer, TRESTTabInfer } from '$lib/validators';
	import type { SuperForm } from 'sveltekit-superforms';
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id']; form: SuperForm<TRESTRequestInfer> };

	export let tabID: $$Props['tabID'];
	export let form: $$Props['form'];

	const tabContext = getRESTTabContext();
</script>

<ToolbarBody {tabID} {form} />
