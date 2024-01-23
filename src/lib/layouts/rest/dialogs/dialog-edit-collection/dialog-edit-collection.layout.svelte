<script lang="ts" context="module">
	import { getRESTTabStore } from '$lib/stores';
	import { RESTRequestSchema, type TRESTTabInfer, type TRESTRequestSchema } from '$lib/validators';
	import { generateUUID } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';

	type TFormAction = 'save' | 'cancel';
</script>

<script lang="ts">
	type $$Props = { form: SuperValidated<TRESTRequestSchema> };

	export let form: $$Props['form'];

	const tabStore = getRESTTabStore();
	$: ({ editing } = $tabStore);
	$: tab = (editing ? tabStore.get(editing) : {}) as TRESTTabInfer;

	const formID = generateUUID();
	const uniqueForm: $$Props['form'] = {
		...structuredClone(form),
		id: formID,
		data: { ...tab?.context }
	};

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
	$: if (editing && editing === tab.id) open = true;
	$: if (editing) superFrm.reset({ data: tab.context });

	function getAction(url: URL) {
		const [action] = [...url.searchParams.keys()];
		return action.replace('/', '') as TFormAction;
	}

	function handleCancel() {
		superFrm.reset();
		tabStore.setEditing(undefined);
		open = false;
	}

	function handleSave() {
		tabStore.update(tab.id, $formValue);
		tabStore.setEditing(undefined);
		tabStore.setDirty([tab.id], true);
		open = false;
	}

	function handleOpenChange(event: boolean) {
		if (!event) handleCancel();
	}

	function handleKeydownSubmit(event: KeyboardEvent) {
		const isInputTarget = event.target instanceof HTMLInputElement;
		if (!isInputTarget) return;

		event.stopPropagation();

		if (event.key === 'Enter') {
			event.preventDefault();
			document.forms.namedItem(formID)?.requestSubmit();
		}
	}
</script>

<Dialog.Root {open} closeOnOutsideClick={false} onOpenChange={handleOpenChange}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit Collection</Dialog.Title>
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
