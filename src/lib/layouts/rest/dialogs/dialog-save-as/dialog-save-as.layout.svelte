<script lang="ts" context="module">
	import { dialogSaveAsStore as dialogStore } from '.';
	import { getRESTContext, getRESTTabContext } from '$lib/contexts';
	import { RESTRequestSchema, type TRESTRequestInfer } from '$lib/validators';
	import { ViewCollections } from '$lib/layouts/rest';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	type TFormAction = 'save' | 'cancel';
</script>

<script lang="ts">
	const [restStore, tabStore] = [getRESTContext(), getRESTTabContext()];

	const superFrm = superForm(defaults(zod(RESTRequestSchema)), {
		SPA: true,
		validators: zod(RESTRequestSchema),
		validationMethod: 'oninput',
		resetForm: true,
		onSubmit: (input) => {
			input.cancel();
			return handleFormSubmit();
		}
	});

	let action: TFormAction = 'save';

	$: ({ form: formValue, formId, allErrors } = superFrm);
	$: isInvalid = Boolean($allErrors.length) || !$formValue.name;
	$: superFrm.reset({ data: $dialogStore.request });

	function handleCancel() {
		dialogStore.set({ open: false, request: undefined });
	}

	function handleSave() {
		dialogStore.set({ open: false, request: undefined });
	}

	function handleFormSubmit() {
		const ACTIONS = { cancel: handleCancel, save: handleSave } as const;
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

		<Form.Root
			id={$formId}
			form={superFrm}
			schema={RESTRequestSchema}
			controlled
			action="?/{action}"
			class="flex max-h-[55vh] flex-col"
			let:config
		>
			<Form.Field {config} name="name">
				<Form.Item>
					<Form.Label for="name">Name</Form.Label>
					<Form.Input type="text" id="name" name="name" autocomplete="off" />
				</Form.Item>
			</Form.Field>

			<Form.Fieldset class="mt-4 h-full">
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

					<ViewCollections />
				</div>
			</Form.Fieldset>
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
