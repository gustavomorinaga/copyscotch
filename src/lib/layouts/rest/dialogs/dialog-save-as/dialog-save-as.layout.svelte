<script lang="ts" context="module">
	import { dialogSaveAsStore as dialogStore } from '.';
	import { getRESTContext, getRESTTabContext } from '$lib/contexts';
	import { RESTRequestSchema, type TRESTRequestInfer } from '$lib/validators';
	import { ViewSelectCollections, treeSelectCollectionStore as treeStore } from '$lib/layouts/rest';
	import { Button } from '$lib/components/ui/button';
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

	let action: TFormAction = 'save';

	const form = superForm(defaults(zod(RESTRequestSchema)), {
		id: 'dialog-save-as',
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

	$: isInvalid =
		Boolean($allErrors.length) || ![$formData.name, $treeStore.selectedID].some(Boolean);
	$: form.reset({ data: $dialogStore.request });

	function handleCancel() {
		dialogStore.set({ open: false, request: undefined });
	}

	function handleSave() {
		if (!$dialogStore.request) return;

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

	function handleFormSubmit() {
		const ACTIONS = { cancel: handleCancel, save: handleSave } as const satisfies Record<
			TFormAction,
			() => void
		>;
		return ACTIONS[action]();
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

		<form id={$formId} method="POST" action="?/{action}" class="flex max-h-[55vh] flex-col">
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input {...attrs} type="text" autocomplete="off" bind:value={$formData.name} />
				</Form.Control>
			</Form.Field>

			<Form.Fieldset {form} name="id" class="mt-4 h-full">
				<Form.Legend class="text-sm">Select Location</Form.Legend>

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
			</Form.Fieldset>
		</form>

		<Dialog.Footer>
			<Button type="submit" variant="ghost" form={$formId} on:click={() => (action = 'cancel')}>
				Cancel
			</Button>
			<Button
				type="submit"
				variant="default"
				form={$formId}
				disabled={isInvalid}
				on:click={() => (action = 'save')}
			>
				Save
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
