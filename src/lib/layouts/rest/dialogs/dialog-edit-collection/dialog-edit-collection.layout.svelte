<script lang="ts" context="module">
	import { dialogEditCollectionStore as dialogStore, type TCollectionDialogStore } from '.';
	import { getRESTContext } from '$lib/contexts';
	import { generateUUID } from '$lib/utils';
	import { RESTBaseFolderSchema, type TRESTCollectionInfer } from '$lib/validators';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

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

	let action: TFormAction = 'save';

	const form = superForm(defaults(zod(RESTBaseFolderSchema)), {
		id: 'dialog-edit-collection',
		SPA: true,
		validators: zod(RESTBaseFolderSchema),
		validationMethod: 'oninput',
		onSubmit: (input) => {
			input.cancel();
			return handleFormSubmit();
		}
	});

	const { formId, enhance } = form;
	$: ({ form: formData, allErrors } = form);

	$: isInvalid = Boolean($allErrors.length) || !$formData.name;
	$: form.reset({ data: $dialogStore.collection });
	$: ({ title } = DIALOG_PROPS[$dialogStore.type][$dialogStore.mode]);

	function handleCancel() {
		dialogStore.set({ mode: 'create', type: 'collection', open: false, collection: undefined });
	}

	function handleSave() {
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
			<Dialog.Title>{title}</Dialog.Title>
		</Dialog.Header>

		<form id={$formId} method="POST" action="?/save" use:enhance>
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
