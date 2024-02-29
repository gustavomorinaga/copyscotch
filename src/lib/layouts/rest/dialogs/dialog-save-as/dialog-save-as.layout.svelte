<script lang="ts" context="module">
	import { dialogSaveAsStore as dialogStore } from '.';
	import { getRESTContext, getRESTTabContext } from '$lib/contexts';
	import { RESTRequestSchema, type TRESTRequestInfer } from '$lib/validators';
	import { ViewSelectCollections, treeSelectCollectionStore as treeStore } from '$lib/layouts/rest';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	type TFormAction = 'save' | 'cancel';
</script>

<script lang="ts">
	const [restContext, tabContext] = [getRESTContext(), getRESTTabContext()];

	const formID: string = 'dialog-save-as';
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

	$: isInvalid =
		Boolean($allErrors.length) || ![$formData.name, $treeStore.selectedID].every(Boolean);
	$: form.reset({ id: formID, data: $dialogStore.request });

	function handleFormSubmit() {
		const ACTIONS = { cancel: handleCancel, save: handleSave } as const satisfies Record<
			TFormAction,
			() => void
		>;
		return ACTIONS[action]();
	}

	function handleCancel() {
		dialogStore.set({ open: false, request: undefined });
	}

	function handleSave() {
		if (isInvalid || !$dialogStore.request) return;

		const { selectedID, selectedType } = $treeStore;
		if (!selectedID || !selectedType) return;

		const data = $formData as TRESTRequestInfer;

		const ACTIONS = {
			folder: () => restContext.createFile(data, selectedID),
			file: () => restContext.updateFile(data)
		} as const satisfies Record<NonNullable<typeof selectedType>, () => void>;

		ACTIONS[selectedType]();
		tabContext.update(data.id, data);
		tabContext.setDirty([data.id], false);
		$dialogStore.onSave?.();
		dialogStore.set({ open: false, request: undefined });
	}

	function handleOpenChange(event: boolean) {
		if (!event) handleCancel();
	}
</script>

<Dialog.Root
	bind:open={$dialogStore.open}
	closeOnOutsideClick={false}
	onOpenChange={handleOpenChange}
>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Save As</Dialog.Title>
		</Dialog.Header>

		<form
			id={formID}
			method="POST"
			action="?/{action}"
			class="flex max-h-[55vh] flex-col"
			use:enhance
		>
			<Form.Field {form} name="name" class="flex shrink-0 flex-col">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input {...attrs} type="text" autocomplete="off" bind:value={$formData.name} />
				</Form.Control>
			</Form.Field>

			<fieldset class="mt-4 flex h-full flex-1 flex-col">
				<legend class="mb-4 select-none text-sm font-medium">Select Location</legend>

				<div
					class="relative flex h-full flex-1 flex-col overflow-y-auto rounded-md border border-border"
				>
					<div class="sticky top-0 z-10 inline-flex shrink-0 flex-col">
						<Breadcrumb.Root class="w-full select-none bg-background">
							<Breadcrumb.Item>My Workspace</Breadcrumb.Item>
							<Breadcrumb.Separator />
							<Breadcrumb.Item current class="capitalize">Collections</Breadcrumb.Item>
						</Breadcrumb.Root>
						<Separator orientation="horizontal" />
					</div>

					<ViewSelectCollections />
				</div>
			</fieldset>
		</form>

		<Dialog.Footer>
			<Form.Button
				variant="ghost"
				form={formID}
				aria-label="Cancel"
				on:click={() => (action = 'cancel')}
			>
				<span>Cancel</span>
			</Form.Button>
			<Form.Button
				variant="default"
				form={formID}
				aria-label="Save"
				disabled={isInvalid}
				on:click={() => (action = 'save')}
			>
				<span>Save</span>
			</Form.Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
