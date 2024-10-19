<script lang="ts" context="module">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { dialogEditRequestStore as dialogStore } from '.';
	import { getRESTContext, getRESTTabContext } from '$lib/contexts';
	import { RESTRequestSchema, type TRESTRequestInfer } from '$lib/validators';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';

	type TFormAction = 'save' | 'cancel';
</script>

<script lang="ts">
	const [restContext, tabContext] = [getRESTContext(), getRESTTabContext()];

	const formID = 'dialog-edit-request';
	let action: TFormAction = 'save';

	const form = superForm(defaults(zod(RESTRequestSchema)), {
		id: formID,
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

	const { enhance } = form;
	$: ({ form: formData, allErrors } = form);

	$: isInvalid = Boolean($allErrors.length) || !$formData.name;
	$: form.reset({ id: formID, data: $dialogStore.request });

	function handleCancel() {
		dialogStore.set({ mode: 'create', open: false, collectionID: '', request: undefined });
	}

	function handleSave() {
		if (isInvalid) return;

		const ACTIONS = {
			create: () => {
				if (!$dialogStore.collectionID) return;
				restContext.createFile($formData as TRESTRequestInfer, $dialogStore.collectionID);
			},
			edit: () => {
				if (!$dialogStore.request) return;

				const { id: requestID } = $dialogStore.request as TRESTRequestInfer;
				if (!requestID) return;

				if ($dialogStore.forceSave) restContext.updateFile($formData as TRESTRequestInfer);

				const tab = tabContext.getTab(requestID);
				if (!tab) return;

				tabContext.updateTab(requestID, $formData as TRESTRequestInfer);
				if (!$dialogStore.forceSave) tabContext.setDirtyTabs([requestID], true);
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
			document.forms.namedItem(formID)?.requestSubmit();
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

		<form id={formID} method="POST" action="?/{action}" use:enhance>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input
						{...attrs}
						type="text"
						autocomplete="off"
						placeholder="Request name..."
						bind:value={$formData.name}
						on:keydown={handleKeydownSubmit}
					/>
				</Form.Control>
			</Form.Field>
		</form>

		<Dialog.Footer>
			<Form.Button
				variant="ghost"
				form={formID}
				aria-label="Cancel"
				on:click={() => (action = 'cancel')}
			>
				<span class="select-none">Cancel</span>
			</Form.Button>
			<Form.Button
				variant="default"
				form={formID}
				aria-label="Save"
				disabled={isInvalid}
				on:click={() => (action = 'save')}
			>
				<span class="select-none">Save</span>
			</Form.Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
