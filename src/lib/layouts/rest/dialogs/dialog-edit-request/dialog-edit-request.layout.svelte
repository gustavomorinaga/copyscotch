<script lang="ts" context="module">
	import { getRESTStore } from '$lib/stores';
	import {
		editRequestSchema as schema,
		type TRESTRequestSchemaInfer,
		type TRESTRequestSchema
	} from '$lib/validators';
	import { randomID } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
</script>

<script lang="ts">
	type $$Props = {
		requestID: TRESTRequestSchemaInfer['id'];
		form: SuperValidated<TRESTRequestSchema>;
	};

	export let form: $$Props['form'];
	export let requestID: $$Props['requestID'];

	const restStore = getRESTStore();
	const formID = randomID();

	const request = restStore.getRequest(requestID) as TRESTRequestSchemaInfer;
	const uniqueForm = { ...structuredClone(form), id: formID, data: request };

	const superFrm = superForm(uniqueForm, {
		validators: schema,
		validationMethod: 'onblur',
		taintedMessage: false
	});

	$: ({ form: formValue } = superFrm);
	$: isActive = $restStore.activeRequest === requestID;
	$: isPredicted = $restStore.predictedRequest === requestID;
	$: showContent = $restStore.predictedRequest ? isPredicted : isActive;
	$: open = $restStore.editRequest === requestID;
	$: if ($restStore.requests) {
		const updatedRequest = restStore.getRequest(requestID);
		if (updatedRequest) $formValue = updatedRequest;
	}

	function onDblClick() {
		restStore.setEditRequest(requestID);
	}

	function onCancel() {
		superFrm.reset();
		restStore.setEditRequest(undefined);
		restStore.setPredictedRequest(undefined);
	}

	function onSave() {
		restStore.updateRequest(requestID, $formValue);
		restStore.setEditRequest(undefined);
		restStore.setPredictedRequest(undefined);
	}
</script>

<Dialog.Root {open} closeOnOutsideClick={false}>
	<Dialog.Trigger asChild>
		<div role="presentation" tabindex="-1" on:dblclick={onDblClick}>
			<slot />
		</div>
	</Dialog.Trigger>

	{#if showContent}
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Edit Request</Dialog.Title>
			</Dialog.Header>

			<Form.Root form={superFrm} {schema} controlled let:config>
				<Form.Field {config} name="name">
					<Form.Item>
						<Form.Label for="name">Name</Form.Label>
						<Form.Input type="text" id="name" name="name" />
					</Form.Item>
				</Form.Field>
			</Form.Root>

			<Dialog.Footer>
				<Button type="submit" variant="ghost" on:click={onCancel}>Cancel</Button>
				<Button type="submit" variant="default" on:click={onSave}>Save</Button>
			</Dialog.Footer>
		</Dialog.Content>
	{/if}
</Dialog.Root>
