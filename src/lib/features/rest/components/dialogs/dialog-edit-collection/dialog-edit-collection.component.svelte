<script lang="ts" context="module">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { type TCollectionDialogStore, dialogEditCollectionStore as dialogStore } from '.';
	import { getRESTContext } from '$lib/contexts/rest';
	import { generateUUID } from '$lib/utils/uuid';
	import { RESTBaseFolderSchema, type TRESTCollectionInfer } from '$lib/schemas/collection';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';

	type TFormAction = 'save' | 'cancel';
	type TDialogProp = Record<
		TCollectionDialogStore['type'],
		Record<TCollectionDialogStore['mode'], { title: string }>
	>;

	const DIALOG_PROPS: TDialogProp = {
		collection: {
			create: {
				title: 'Create Collection'
			},
			edit: {
				title: 'Edit Collection'
			}
		},
		folder: {
			create: {
				title: 'Create Folder'
			},
			edit: {
				title: 'Edit Folder'
			}
		}
	} as const;
</script>

<script lang="ts">
	const restContext = getRESTContext();

	const formID = 'dialog-edit-collection';
	let action: TFormAction = 'save';

	const form = superForm(defaults(zod(RESTBaseFolderSchema)), {
		id: formID,
		SPA: true,
		validators: zod(RESTBaseFolderSchema),
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
	$: form.reset({ id: formID, data: $dialogStore.collection });
	$: ({ title } = DIALOG_PROPS[$dialogStore.type][$dialogStore.mode]);

	function handleCancel() {
		dialogStore.set({ mode: 'create', type: 'collection', open: false, collection: undefined });
	}

	function handleSave() {
		if (isInvalid) return;

		const ACTIONS = {
			create: () => {
				const initialData: Pick<TRESTCollectionInfer, 'id' | 'requests' | 'folders'> = {
					id: generateUUID(),
					requests: [],
					folders: []
				};
				const collection: TRESTCollectionInfer = { ...$formData, ...initialData };
				restContext.createFolder(collection, $dialogStore.parentID);
			},
			edit: () => {
				if (!$dialogStore.collection) return;

				const collection: TRESTCollectionInfer = {
					...$dialogStore.collection,
					name: $formData.name
				};
				restContext.updateFolder(collection);
			}
		};

		ACTIONS[$dialogStore.mode]();
		dialogStore.set({ mode: 'create', type: 'collection', open: false, collection: undefined });
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
			<Dialog.Title>{title}</Dialog.Title>
		</Dialog.Header>

		<form id={formID} method="POST" action="?/{action}" use:enhance>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input
						{...attrs}
						type="text"
						autocomplete="off"
						placeholder="Collection name..."
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
