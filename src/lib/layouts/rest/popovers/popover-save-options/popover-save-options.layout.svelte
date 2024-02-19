<script lang="ts" context="module">
	import { getRESTTabStore } from '$lib/stores';
	import * as Popover from '$lib/components/ui/popover';
	import * as Form from '$lib/components/ui/form';
	import { FolderPlus } from 'lucide-svelte';
	import { RESTRequestSchema, type TRESTTabInfer } from '$lib/validators';
	import { defaults, superForm, type ChangeEvent } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	const SaveOptionsSchema = RESTRequestSchema.pick({ name: true });
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id'] };

	export let tabID: $$Props['tabID'];

	const tabStore = getRESTTabStore();

	const superFrm = superForm(defaults(zod(SaveOptionsSchema)), {
		id: `save-options-${tabID}`,
		SPA: true,
		validators: zod(SaveOptionsSchema),
		validationMethod: 'onblur',
		resetForm: true,
		onChange: handleOnChange,
		onSubmit: (input) => {
			input.cancel();
			return handleFormSubmit();
		}
	});

	$: ({ form: formValue, formId } = superFrm);
	$: if ($tabStore.tabs) {
		const updatedTab = tabStore.get(tabID);
		if (updatedTab) $formValue = updatedTab.context;
	}

	function handleFormSubmit() {
		// tabStore.update(tabID, superFrm.formValue);
		// tabStore.setDirty([tabID], true);
	}

	function handleOnChange(_: ChangeEvent) {
		tabStore.setDirty([tabID], true);
		tabStore.update(tabID, { name: $formValue.name });
	}
</script>

<Popover.Root disableFocusTrap>
	<Popover.Trigger asChild let:builder>
		<slot {builder} />
	</Popover.Trigger>
	<Popover.Content align="start" sideOffset={8} class="w-60 bg-background">
		<Form.Root
			id={$formId}
			form={superFrm}
			schema={SaveOptionsSchema}
			controlled
			class="flex flex-col gap-2"
			let:config
		>
			<Form.Field {config} name="name">
				<Form.Item>
					<Form.Input type="text" autocomplete="off" placeholder="Request Name" class="bg-input" />
				</Form.Item>
			</Form.Field>

			<Form.Button type="submit" size="sm" variant="ghost">
				<FolderPlus class="mr-2 h-4 w-4" />
				Save As
			</Form.Button>
		</Form.Root>
	</Popover.Content>
</Popover.Root>
