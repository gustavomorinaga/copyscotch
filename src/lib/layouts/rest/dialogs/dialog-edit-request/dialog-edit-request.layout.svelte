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

	type TFormAction = 'save' | 'cancel';
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
		taintedMessage: false,
		onSubmit: (input) => {
			const formAction = getAction(input.action);
			const actionMap = { cancel: handleCancel, save: handleSave } as const;
			return actionMap[formAction]();
		}
	});

	$: ({ form: formValue } = superFrm);
	$: open = $restStore.editRequest === requestID;
	$: if ($restStore.activeRequest) {
		const updatedRequest = restStore.getRequest(requestID);
		if (updatedRequest) $formValue = updatedRequest;
	}

	function onDblClick() {
		restStore.setEditRequest(requestID);
	}

	function handleCancel() {
		superFrm.reset();
		restStore.setEditRequest(undefined);
	}

	function handleSave() {
		restStore.updateRequest(requestID, $formValue);
		restStore.setEditRequest(undefined);
	}

	function handleKeydownSubmit(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			document.forms.namedItem(formID)?.requestSubmit();
		}
	}

	function getAction(url: URL) {
		const [action] = [...url.searchParams.keys()];
		return action.replace('/', '') as TFormAction;
	}
</script>

<Dialog.Root bind:open closeOnOutsideClick={false}>
	<Dialog.Trigger asChild>
		<div role="presentation" tabindex="-1" on:dblclick={onDblClick}>
			<slot />
		</div>
	</Dialog.Trigger>

	<Dialog.Content transitionConfig={{ delay: 1000 }}>
		<Dialog.Header>
			<Dialog.Title>Edit Request</Dialog.Title>
		</Dialog.Header>

		<Form.Root id={formID} form={superFrm} {schema} controlled action="?/save" let:config>
			<Form.Field {config} name="name">
				<Form.Item>
					<Form.Label for="name">Name</Form.Label>
					<Form.Input type="text" id="name" name="name" on:keydown={handleKeydownSubmit} />
				</Form.Item>
			</Form.Field>
		</Form.Root>

		<Dialog.Footer>
			<Button type="submit" variant="ghost" form={formID} formaction="?/cancel">Cancel</Button>
			<Button type="submit" variant="default" form={formID}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
