<script lang="ts" context="module">
	import { dialogEditCollectionStore as dialogStore } from '.';
	import { getRESTStore } from '$lib/stores';
	import { generateUUID } from '$lib/utils';
	import { RESTBaseFolderSchema, type TRESTCollectionInfer } from '$lib/validators';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	type TFormAction = 'save' | 'cancel';
</script>

<script lang="ts">
	const restStore = getRESTStore();

	const superFrm = superForm(defaults(zod(RESTBaseFolderSchema)), {
		SPA: true,
		validators: zod(RESTBaseFolderSchema),
		validationMethod: 'onblur',
		onSubmit: (input) => {
			input.cancel();
			const formAction = getAction(input.action);
			const actionMap = { cancel: handleCancel, save: handleSave } as const;
			return actionMap[formAction]();
		}
	});

	$: ({ form: formValue, formId, allErrors } = superFrm);
	$: isInvalid = Boolean($allErrors.length) || !$formValue.name;
	$: superFrm.reset({ id: $dialogStore.collection?.id, data: $dialogStore.collection });

	function getAction(url: URL) {
		const [action] = [...url.searchParams.keys()];
		return action.replace('/', '') as TFormAction;
	}

	function handleCancel() {
		dialogStore.set({ mode: 'create', open: false, collection: undefined });
	}

	function handleSave() {
		if (!$dialogStore.collection) return;

		const saveAction = {
			create: () => {
				const data = {
					...$formValue,
					id: generateUUID(),
					requests: [],
					folders: []
				} as TRESTCollectionInfer;
				restStore.saveCollection(data);
			},
			edit: () => console.log($formValue)
		};

		saveAction[$dialogStore.mode]();
		dialogStore.set({ mode: 'create', open: false, collection: undefined });
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
					Create Collection
				{:else if $dialogStore.mode === 'edit'}
					Edit Collection
				{/if}
			</Dialog.Title>
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
					<Form.Input type="text" id="name" name="name" on:keydown={handleKeydownSubmit} />
				</Form.Item>
			</Form.Field>
		</Form.Root>

		<Dialog.Footer>
			<Button type="submit" variant="ghost" form={$formId} formaction="?/cancel">Cancel</Button>
			<Button type="submit" variant="default" form={$formId} disabled={isInvalid}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
