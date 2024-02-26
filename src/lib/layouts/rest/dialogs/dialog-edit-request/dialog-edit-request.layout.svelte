<script lang="ts" context="module">
	import { dialogEditRequestStore as dialogStore } from '.';
	import { getRESTContext, getRESTTabContext } from '$lib/contexts';
	import { RESTRequestSchema, type TRESTRequestInfer } from '$lib/validators';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	type TFormAction = 'save' | 'cancel';
</script>

<script lang="ts">
	const [restContext, tabContext] = [getRESTContext(), getRESTTabContext()];

	let action: TFormAction = 'save';

	const form = superForm(defaults(zod(RESTRequestSchema)), {
		id: 'dialog-edit-request',
		SPA: true,
		dataType: 'json',
		validators: zod(RESTRequestSchema),
		validationMethod: 'oninput',
		resetForm: true,
		onSubmit: (input) => {
			input.cancel();
			return handleFormSubmit();
		}
	});

	const { formId, enhance } = form;
	$: ({ form: formData, allErrors } = form);

	$: isInvalid = Boolean($allErrors.length) || !$formData.name;
	$: form.reset({ data: $dialogStore.request });

	function handleCancel() {
		dialogStore.set({ mode: 'create', open: false, collectionID: '', request: undefined });
	}

	function handleSave() {
		const ACTIONS = {
			create: () => {
				if (!$dialogStore.collectionID) return;
				restContext.createFile($formData as TRESTRequestInfer, $dialogStore.collectionID);
			},
			edit: () => {
				if (!$dialogStore.request) return;

				const { id: requestID } = $dialogStore.request as TRESTRequestInfer;
				if (!requestID) return;

				if ($dialogStore.forceSave) {
					const request: TRESTRequestInfer = { ...$dialogStore.request, name: $formData.name };
					restContext.updateFile(request);
				}

				const tab = tabContext.get(requestID);
				if (!tab) return;

				tabContext.update(requestID, $formData as TRESTRequestInfer);
				if (!$dialogStore.forceSave) tabContext.setDirty([requestID], true);
			}
		} as const satisfies Record<typeof $dialogStore.mode, () => void>;

		ACTIONS[$dialogStore.mode]();
		dialogStore.set({ mode: 'create', open: false, collectionID: undefined, request: undefined });
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
	<Dialog.Content class="z-[60]" overlayClass="z-[60]">
		<Dialog.Header>
			<Dialog.Title>
				{#if $dialogStore.mode === 'create'}
					Create Request
				{:else if $dialogStore.mode === 'edit'}
					Edit Request
				{/if}
			</Dialog.Title>
		</Dialog.Header>

		<form id={$formId} method="POST" action="?/{action}" use:enhance>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input
						{...attrs}
						type="text"
						autocomplete="off"
						bind:value={$formData.name}
						on:keydown={handleKeydownSubmit}
					/>
				</Form.Control>
			</Form.Field>
		</form>

		<Dialog.Footer>
			<Form.Button variant="ghost" form={$formId} on:click={() => (action = 'cancel')}>
				Cancel
			</Form.Button>
			<Form.Button
				variant="default"
				form={$formId}
				disabled={isInvalid}
				on:click={() => (action = 'save')}
			>
				Save
			</Form.Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
