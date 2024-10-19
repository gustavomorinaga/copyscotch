<script lang="ts" context="module">
	import { onDestroy } from 'svelte';
	import ArrowLeft from 'lucide-svelte/icons/arrow-left';
	import CheckCircleBig from 'lucide-svelte/icons/circle-check-big';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { toast } from 'svelte-sonner';
	import { zod } from 'sveltekit-superforms/adapters';
	import { dialogImportStore as dialogStore } from '$lib/features/rest/components/dialogs/dialog-import';
	import { getRESTContext } from '$lib/contexts/rest';
	import { RESTCollectionSchema, type TRESTCollectionInfer } from '$lib/schemas/collection';
	import { FileUploadSchema } from '$lib/schemas/file-upload';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';

	type TFormAction = 'import' | 'cancel';
</script>

<script lang="ts">
	import { Spinner } from '$lib/components/ui/spinner';

	type $$Props = { onCancel?: () => void };

	export let onCancel: $$Props['onCancel'] = undefined;

	const restContext = getRESTContext();

	const formID: string = 'dialog-import';
	let action: TFormAction = 'import';
	let loading: boolean = false;
	let parsedJSON: Array<TRESTCollectionInfer> = [];

	const form = superForm(defaults(zod(FileUploadSchema)), {
		id: formID,
		SPA: true,
		dataType: 'json',
		validators: zod(FileUploadSchema),
		validationMethod: 'oninput',
		resetForm: true,
		onSubmit: (input) => {
			input.cancel();
			return handleFormSubmit();
		}
	});

	const { enhance } = form;
	$: ({ form: formData, errors, allErrors } = form);
	$: isInvalid = Boolean($allErrors.length) || !$formData.file;

	function handleOnInput(event: Event) {
		const target = event.target as HTMLInputElement;
		$formData.file = target.files?.item(0) as File;
		handleValidateFile($formData.file);
	}

	function handleFormSubmit() {
		const ACTIONS = { cancel: handleCancel, import: handleImport } as const satisfies Record<
			TFormAction,
			() => void
		>;

		Promise.resolve(ACTIONS[action]()).then(() => (parsedJSON.length = 0));
	}

	function handleCancel() {
		onCancel?.();
	}

	function handleImport() {
		if (isInvalid) return;

		loading = true;

		return new Promise<void>((resolve) => {
			restContext.import(parsedJSON);
			setTimeout(() => {
				loading = false;
				dialogStore.set({ open: false });
				toast.success('Collections imported successfully!');
				resolve();
			}, 600);
		});
	}

	function handleValidateFile(file: File) {
		const reader = new FileReader();
		reader.readAsText(file);
		reader.onload = () => {
			const content = reader.result as string;
			const json = JSON.parse(content);

			try {
				parsedJSON = RESTCollectionSchema.array().parse(json);
			} catch {
				$errors.file = ['Invalid JSON file, please try again'];
			}
		};
	}

	onDestroy(() => {
		handleCancel();
	});
</script>

<form
	id={formID}
	method="POST"
	action="?/{action}"
	enctype="multipart/form-data"
	class="flex max-h-[55vh] flex-col"
	use:enhance
>
	<div class="mb-2 flex items-center">
		<CheckCircleBig
			class="mr-4 h-6 w-6 shrink-0 {!isInvalid ? 'text-success' : 'text-muted-foreground'}"
		/>
		<span class="select-none text-sm">Import from File</span>
	</div>

	<Form.Field {form} name="file" class="ml-10 flex shrink-0 flex-col">
		<Form.Control let:attrs>
			<div class="rounded border border-dashed border-border">
				<Input
					{...attrs}
					type="file"
					accept="application/json"
					class="h-auto cursor-pointer p-4 text-muted-foreground transition file:mr-2 file:cursor-pointer file:rounded file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-muted-foreground file:transition hover:text-accent-foreground file:hover:bg-secondary/80 file:hover:text-accent-foreground"
					on:input={handleOnInput}
				/>
			</div>

			<Form.FieldErrors />
		</Form.Control>
	</Form.Field>
</form>

<Dialog.Footer>
	<Button variant="outline" aria-label="Go Back" on:click={handleCancel}>
		<ArrowLeft class="h-5 w-5 shrink-0" />
		<span class="sr-only select-none">Go Back</span>
	</Button>

	<Form.Button
		variant="default"
		form={formID}
		aria-label="Import"
		disabled={isInvalid || loading}
		class="w-full"
		on:click={() => (action = 'import')}
	>
		{#if loading}
			<Spinner class="mr-2" />
		{/if}
		<span class="select-none">
			{loading ? 'Importing...' : 'Import'}
		</span>
	</Form.Button>
</Dialog.Footer>
