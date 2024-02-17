<script lang="ts" context="module">
	import { dialogEditCollectionStore as dialogStore, type TCollectionDialogStore } from '.';
	import { getRESTStore } from '$lib/stores';
	import { generateUUID } from '$lib/utils';
	import { RESTBaseFolderSchema, type TRESTCollectionInfer } from '$lib/validators';
	import { Button } from '$lib/components/ui/button';
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
	const restStore = getRESTStore();

	const superFrm = superForm(defaults(zod(RESTBaseFolderSchema)), {
		SPA: true,
		validators: zod(RESTBaseFolderSchema),
		validationMethod: 'onblur',
		onSubmit: (input) => {
			input.cancel();
			return handleFormSubmit();
		}
	});

	let action: TFormAction = 'save';

	$: ({ form: formValue, formId, allErrors } = superFrm);
	$: isInvalid = Boolean($allErrors.length) || !$formValue.name;
	$: superFrm.reset({
		id: `edit-collection-${$dialogStore.collection?.id}`,
		data: $dialogStore.collection
	});
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
				const collection: TRESTCollectionInfer = { ...$formValue, ...initialData };
				restStore.createFolder(collection, $dialogStore.parentID);
			},
			edit: () => {
				if (!$dialogStore.collection) return;

				const collection: TRESTCollectionInfer = {
					...$dialogStore.collection,
					name: $formValue.name
				};
				restStore.updateFolder(collection);
			}
		};

		ACTIONS[$dialogStore.mode]();
		dialogStore.set({ mode: 'create', type: 'collection', open: false, collection: undefined });
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
			<Dialog.Title>{title}</Dialog.Title>
		</Dialog.Header>

		<Form.Root
			id={$formId}
			form={superFrm}
			schema={RESTBaseFolderSchema}
			controlled
			action="?/save"
			let:config
		>
			<Form.Field {config} name="name">
				<Form.Item>
					<Form.Label for="name">Name</Form.Label>
					<Form.Input
						type="text"
						id="name"
						name="name"
						autocomplete="off"
						on:keydown={handleKeydownSubmit}
					/>
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
				on:click={() => (action = 'save')}
			>
				Save
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
