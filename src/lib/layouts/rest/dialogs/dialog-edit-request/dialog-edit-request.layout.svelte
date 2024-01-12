<script lang="ts" context="module">
	import { getRESTTabStore } from '$lib/stores';
	import {
		RESTRequestSchema,
		type TRESTRequestInfer,
		type TRESTTabInfer,
		type TRESTRequestSchema
	} from '$lib/validators';
	import { generateUUID } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';

	type TFormAction = 'save' | 'cancel';
</script>

<script lang="ts">
	type $$Props = {
		tabID: TRESTRequestInfer['id'];
		form: SuperValidated<TRESTRequestSchema>;
	};

	export let form: $$Props['form'];
	export let tabID: $$Props['tabID'];

	const tabStore = getRESTTabStore();
	$: ({ current, editing } = $tabStore);

	const formID = generateUUID();
	const { context: request } = tabStore.get(tabID) as TRESTTabInfer;
	const uniqueForm = { ...structuredClone(form), id: formID, data: request };

	const superFrm = superForm(uniqueForm, {
		SPA: true,
		validators: RESTRequestSchema,
		validationMethod: 'onblur',
		taintedMessage: false,
		onSubmit: (input) => {
			const formAction = getAction(input.action);
			const actionMap = { cancel: handleCancel, save: handleSave } as const;
			return actionMap[formAction]();
		}
	});

	let open = false;

	$: ({ form: formValue } = superFrm);
	$: if (editing === tabID) open = true;
	$: if (current) {
		const updatedTab = tabStore.get(tabID);
		if (updatedTab) $formValue = updatedTab.context;
	}

	function getAction(url: URL) {
		const [action] = [...url.searchParams.keys()];
		return action.replace('/', '') as TFormAction;
	}

	function onDblClick() {
		tabStore.setEditing(tabID);
	}

	function handleCancel() {
		superFrm.reset();
		tabStore.setEditing(undefined);
		open = false;
	}

	function handleSave() {
		tabStore.update(tabID, $formValue);
		tabStore.setEditing(undefined);
		open = false;
	}

	function handleOpenChange(event: boolean) {
		if (!event) handleCancel();
	}

	function handleKeydownSubmit(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			document.forms.namedItem(formID)?.requestSubmit();
		}
	}
</script>

<Dialog.Root bind:open closeOnOutsideClick={false} onOpenChange={handleOpenChange}>
	<Dialog.Trigger asChild>
		<div role="presentation" tabindex="-1" on:dblclick={onDblClick}>
			<slot />
		</div>
	</Dialog.Trigger>

	<Dialog.Content transitionConfig={{ delay: 1000 }}>
		<Dialog.Header>
			<Dialog.Title>Edit Request</Dialog.Title>
		</Dialog.Header>

		<Form.Root
			id={formID}
			form={superFrm}
			schema={RESTRequestSchema}
			controlled
			action="?/save"
			let:config
		>
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
