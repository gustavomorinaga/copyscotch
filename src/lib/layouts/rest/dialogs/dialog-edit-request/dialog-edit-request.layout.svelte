<script lang="ts" context="module">
	import { dialogEditRequestStore as dialogStore } from '.';
	import { getRESTTabStore } from '$lib/stores';
	import { RESTRequestSchema } from '$lib/validators';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	type TFormAction = 'save' | 'cancel';
</script>

<script lang="ts">
	const tabStore = getRESTTabStore();

	const superFrm = superForm(defaults(zod(RESTRequestSchema)), {
		SPA: true,
		validators: zod(RESTRequestSchema),
		validationMethod: 'onblur',
		onSubmit: handleFormSubmit
	});

	let action: TFormAction = 'save';

	$: ({ form: formValue, formId, allErrors } = superFrm);
	$: isInvalid = Boolean($allErrors.length) || !$formValue.name;
	$: superFrm.reset({
		id: `edit-request-${$dialogStore.request?.id}`,
		data: $dialogStore.request
	});

	function handleCancel() {
		dialogStore.set({ mode: 'create', open: false, request: undefined });
	}

	function handleSave() {
		if (!$dialogStore.request) return;

		const { id: requestID } = $dialogStore.request;

		const MODES = {
			create: () => {},
			edit: () => {
				const tab = tabStore.get(requestID);
				if (!tab) return;

				tabStore.update(requestID, $formValue);
				tabStore.setDirty([requestID], true);
			}
		};

		MODES[$dialogStore.mode]();

		dialogStore.set({ mode: 'create', open: false, request: undefined });
	}

	function handleFormSubmit() {
		const ACTIONS = { cancel: handleCancel, save: handleSave } as const;
		return ACTIONS[action]();
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
			$formId && document.forms.namedItem($formId)?.requestSubmit();
		}
	}
</script>

<Dialog.Root
	bind:open={$dialogStore.open}
	closeOnOutsideClick={false}
	onOpenChange={handleOpenChange}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>
				{#if $dialogStore.mode === 'create'}
					Create Request
				{:else if $dialogStore.mode === 'edit'}
					Edit Request
				{/if}
			</Dialog.Title>
		</Dialog.Header>

		<Form.Root
			id={$formId}
			form={superFrm}
			schema={RESTRequestSchema}
			controlled
			action="?/{action}"
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
			<Button type="submit" variant="ghost" form={$formId} on:click={() => (action = 'cancel')}>
				Cancel
			</Button>
			<Button
				type="submit"
				variant="default"
				form={$formId}
				disabled={isInvalid}
				on:click={() => (action = 'cancel')}
			>
				Save
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
