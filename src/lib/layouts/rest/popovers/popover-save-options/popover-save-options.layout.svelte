<script lang="ts" context="module">
	import { getRESTTabContext } from '$lib/contexts';
	import { dialogSaveAsStore as dialogStore } from '$lib/layouts/rest';
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
	let tab: TRESTTabInfer;
	let open: boolean = false;

	const tabContext = getRESTTabContext();

	const form = superForm(defaults(zod(SaveOptionsSchema)), {
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

	$: ({ form: formValue, formId } = form);
	$: if ($tabContext.tabs) {
		tab = tabContext.get(tabID) as TRESTTabInfer;
		if (tab) $formValue = tab.context;
	}

	function handleFormSubmit() {
		dialogStore.set({ open: true, request: tab.context });
		open = false;
	}

	function handleOnChange(event: ChangeEvent) {
		if (!event.target) return;
		tabContext.setDirty([tabID], true);
		tabContext.update(tabID, { name: $formValue.name });
	}
</script>

<Popover.Root bind:open disableFocusTrap>
	<Popover.Trigger asChild let:builder>
		<slot {builder} />
	</Popover.Trigger>
	<Popover.Content align="end" side="bottom" sideOffset={8} class="w-60 bg-background">
		<Form.Root
			id={$formId}
			{form}
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
