<script lang="ts" context="module">
	import { getRESTStore } from '$lib/stores';
	import * as Form from '$lib/components/ui/form';
	import {
		editRequestSchema as schema,
		type TRESTEditRequestSchema,
		type TRESTRequestSchemaType
	} from '$lib/validators';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
</script>

<script lang="ts">
	type $$Props = {
		requestID: TRESTRequestSchemaType['id'];
		form: SuperValidated<TRESTEditRequestSchema>;
	};

	export let form: $$Props['form'];
	export let requestID: $$Props['requestID'];

	const restStore = getRESTStore();
	const formID = `edit-${requestID}`;

	const index = $restStore.requests.findIndex(({ id }) => id === requestID);
	const request = $restStore.requests[index];
	const uniqueForm = { ...structuredClone(form), id: formID, data: request };

	const superFrm = superForm(uniqueForm, {
		validators: schema,
		validationMethod: 'onblur',
		taintedMessage: false
	});

	$: ({ form: formValue } = superFrm);

	function onChange() {
		restStore.updateRequest(requestID, $formValue);
	}
</script>

<Form.Root form={superFrm} {schema} controlled let:config on:change={onChange} class="px-2">
	<Form.Join class="w-full gap-2">
		<Form.Field {config} name="url">
			<Form.Item class="grow">
				<Form.Input type="url" placeholder="URL" />
			</Form.Item>
		</Form.Field>
		<Form.Button>Send</Form.Button>
	</Form.Join>
</Form.Root>
