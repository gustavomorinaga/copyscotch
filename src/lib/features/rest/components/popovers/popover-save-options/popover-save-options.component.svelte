<script lang="ts" context="module">
	import FolderPlus from 'lucide-svelte/icons/folder-plus';
	import { type ChangeEvent, defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import { getRESTTabContext } from '$lib/contexts/rest';
	import { dialogSaveAsStore as dialogStore } from '$lib/features/rest/components/dialogs/dialog-save-as';
	import { Input } from '$lib/components/ui/input';
	import * as Popover from '$lib/components/ui/popover';
	import * as Form from '$lib/components/ui/form';
	import { RESTRequestSchema, type TRESTTabInfer } from '$lib/schemas/rest';

	const SaveOptionsSchema = RESTRequestSchema.pick({ name: true });
	type TSaveOptionsInfer = z.infer<typeof SaveOptionsSchema>;
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id'] };

	export let tabID: $$Props['tabID'];
	const formID: string = `save-options-${tabID}`;
	let tab: TRESTTabInfer;
	let open: boolean = false;

	const tabContext = getRESTTabContext();

	const form = superForm(defaults(zod(SaveOptionsSchema)), {
		id: formID,
		SPA: true,
		dataType: 'json',
		validators: zod(SaveOptionsSchema),
		validationMethod: 'onblur',
		resetForm: true,
		onChange: handleOnChange,
		onSubmit: (input) => {
			input.cancel();
			return handleFormSubmit();
		}
	});

	const { enhance } = form;
	$: ({ form: formData } = form);

	$: if ($tabContext.tabs) {
		tab = tabContext.getTab(tabID) as TRESTTabInfer;
		if (tab) $formData = tab.context;
	}

	function handleFormSubmit() {
		dialogStore.set({ open: true, request: tab.context });
		open = false;
	}

	function handleOnChange(event: ChangeEvent<TSaveOptionsInfer>) {
		if (!event.target) return;
		tabContext.setDirtyTabs([tabID], true);
		tabContext.updateTab(tabID, { name: $formData.name });
	}
</script>

<Popover.Root bind:open disableFocusTrap>
	<Popover.Trigger asChild let:builder>
		<slot {builder} />
	</Popover.Trigger>
	<Popover.Content align="end" side="bottom" sideOffset={8} class="w-60 bg-background">
		<form id={formID} method="POST" class="flex flex-col gap-2" use:enhance>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Input
						{...attrs}
						type="text"
						autocomplete="off"
						placeholder="Request Name"
						class="bg-input"
						bind:value={$formData.name}
					/>
				</Form.Control>
			</Form.Field>

			<Form.Button size="sm" variant="ghost" aria-label="Save As">
				<FolderPlus class="mr-2 h-4 w-4 shrink-0" />
				<span class="select-none">Save As</span>
			</Form.Button>
		</form>
	</Popover.Content>
</Popover.Root>
