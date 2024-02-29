<script lang="ts" context="module">
	import { getRESTContext, getRESTTabContext } from '$lib/contexts';
	import {
		RESTRequestSchema,
		MethodEnum,
		RequestTabsEnum,
		type TRESTRequestInfer,
		type TRESTTabInfer,
		type TKeyValueMapped
	} from '$lib/validators';
	import { fetcher } from '$lib/functions';
	import { dialogSaveAsStore as dialogStore } from '$lib/layouts/rest/dialogs/dialog-save-as';
	import { PopoverSaveOptions } from '$lib/layouts/rest/popovers/popover-save-options';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Input } from '$lib/components/ui/input';
	import * as Shortcut from '$lib/components/ui/shortcut';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Select from '$lib/components/ui/select';
	import * as Form from '$lib/components/ui/form';
	import * as Tabs from '$lib/components/ui/tabs';
	import { REGEXES, SHORTCUTS, UNICODES } from '$lib/maps';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Save from 'lucide-svelte/icons/save';
	import { defaults, superForm, type ChangeEvent, type SuperForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { TTab } from '$lib/ts';

	type TFormAction = 'send' | 'cancel' | 'save';
	type TAvailableTabs = (typeof RequestTabsEnum.options)[number];

	const LAZY_TABS = [
		{
			value: 'params',
			label: 'parameters',
			content: import('$lib/layouts/rest/tabs/tab-params'),
			disabled: false
		},
		{
			value: 'body',
			label: 'body',
			content: import('$lib/layouts/rest/tabs/tab-body'),
			disabled: false
		},
		{
			value: 'headers',
			label: 'headers',
			content: import('$lib/layouts/rest/tabs/tab-headers'),
			disabled: false
		}
		// TODO - Add 'body' and 'authorization' tabs
	] as const satisfies Array<TTab>;
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id'] };

	export let tabID: $$Props['tabID'];
	const formID: string = `tab-request-${tabID}`;

	const [restContext, tabContext] = [getRESTContext(), getRESTTabContext()];
	const { options: methodOptions } = MethodEnum;

	let tab!: TRESTTabInfer;
	let currentTab!: TAvailableTabs;
	let action: TFormAction = 'send';
	let controller = new AbortController();

	const form = superForm(defaults(zod(RESTRequestSchema)), {
		id: formID,
		SPA: true,
		dataType: 'json',
		validators: zod(RESTRequestSchema),
		validationMethod: 'oninput',
		resetForm: false,
		onChange: handleOnChange,
		onSubmit: handleFormSubmit
	}) as SuperForm<TRESTRequestInfer>;

	const { enhance } = form;
	$: ({ form: formData, submitting } = form);

	$: sending = $tabContext.results.find((result) => result.id === tabID)?.sending;
	$: if ($tabContext.tabs) {
		tab = tabContext.get(tabID) as TRESTTabInfer;
		if (tab) {
			currentTab = tab.currentTab;
			form.reset({ id: formID, data: tab.context });
		}
	}
	$: countActiveParams = $formData.params.filter((param) => param.active && param.key).length;
	$: countActiveHeaders = $formData.headers.filter((header) => header.active && header.key).length;
	$: dynamicCounters = { params: countActiveParams, headers: countActiveHeaders } as Record<
		TAvailableTabs,
		number
	>;

	function handleCurrentTab(value: TAvailableTabs) {
		currentTab = value;
		tabContext.setCurrentTab(tabID, value);
	}

	function handleOnChange(event: ChangeEvent<TRESTRequestInfer>) {
		if (!event.paths.length) return;

		for (const path of event.paths) {
			let request: Partial<TRESTRequestInfer>;

			const match = path.match(REGEXES.deep);
			if (match) {
				const [, field] = match;
				request = { [field]: $formData[field as keyof TRESTRequestInfer] };
			} else {
				request = { [path as keyof TRESTRequestInfer]: $formData[path as keyof TRESTRequestInfer] };
			}

			tabContext.update(tabID, request);
		}

		tabContext.setDirty([tabID], true);
	}

	function handleKeydown(event: KeyboardEvent) {
		const isMainTarget = event.target instanceof HTMLBodyElement;
		if (!isMainTarget) return;
		if (!$tabContext.current) return;
		if ($tabContext.current !== tabID) return;

		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
			event.preventDefault();
			if ($submitting) return;

			action = sending ? 'cancel' : 'send';
			document.forms.namedItem(formID)?.requestSubmit();
		}

		if ((event.ctrlKey || event.metaKey) && event.key === 's') {
			event.preventDefault();

			action = 'save';
			document.forms.namedItem(formID)?.requestSubmit();
		}
	}

	function handleFormSubmit() {
		const ACTIONS: Record<TFormAction, () => void> = {
			send: handleSend,
			cancel: handleCancel,
			save: handleSave
		};

		return ACTIONS[action]();
	}

	function handleSend() {
		tabContext.setResult(tabID, { response: undefined, sending: true });

		const url = new URL($formData.url);
		let params: TKeyValueMapped = {};
		let headers: TKeyValueMapped = {};

		const activeParams = $formData.params.filter((param) => param.active && param.key);
		const activeHeaders = $formData.headers.filter((header) => header.active && header.key);
		const hasActiveParams = activeParams.length > 0;
		const hasActiveHeaders = activeHeaders.length > 0;

		if (hasActiveParams) {
			params = activeParams.reduce(
				(acc, param) => ({ ...acc, [param.key]: param.value }),
				{} as TKeyValueMapped
			);
			url.search = new URLSearchParams(params).toString();
		}

		if (hasActiveHeaders) {
			headers = activeHeaders.reduce(
				(acc, header) => ({ ...acc, [header.key]: header.value }),
				{} as TKeyValueMapped
			);
		}

		fetcher(url, { method: $formData.method, headers, signal: controller.signal })
			.then((response) => tabContext.setResult(tabID, { response }))
			.catch((error) => {
				const isDOMException = error instanceof DOMException;
				tabContext.setResult(tabID, { response: isDOMException ? undefined : error });
			})
			.finally(() => tabContext.setResult(tabID, { sending: false }));
	}

	function handleCancel() {
		controller.abort();
		controller = new AbortController();
	}

	function handleSave() {
		const data = $formData as TRESTRequestInfer;
		const found = restContext.getFile(tabID);

		const updateTab = () => {
			tabContext.update(tabID, $formData);
			tabContext.setDirty([tabID], false);
		};

		if (found) {
			restContext.updateFile(data);
			updateTab();
		} else {
			dialogStore.set({
				open: true,
				request: data,
				onSave: () => updateTab()
			});
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<form
	id={formID}
	method="POST"
	action="?/{action}"
	class="relative flex h-full w-full flex-1 flex-col"
	use:enhance
>
	<Form.Join class="sticky top-0 z-20 flex-initial shrink-0 flex-wrap gap-2 bg-background p-4">
		<Form.Join class="min-w-[12rem] flex-auto whitespace-nowrap lg:flex-1">
			<Form.Field {form} name="method" class="w-32">
				<Form.Control let:attrs>
					<Select.Root
						selected={{ value: $formData.method, label: $formData.method }}
						onSelectedChange={(v) => v && ($formData.method = v.value)}
					>
						<Select.Trigger
							{...attrs}
							class="relative rounded-l-md rounded-r-none bg-input font-semibold focus:z-10"
						>
							<Select.Value />
						</Select.Trigger>
						<Select.Content>
							{#each methodOptions as method}
								<Select.Item
									value={method}
									style="color: hsl(var(--method-{method.toLowerCase()}-color) / var(--tw-text-opacity))"
								>
									{method}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden name={attrs.name} bind:value={$formData.method} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="url" class="flex-1">
				<Form.Control let:attrs>
					<Input
						{...attrs}
						type="url"
						placeholder="URL"
						class="relative rounded-l-none rounded-r-md border-none bg-input focus:z-10"
						bind:value={$formData.url}
					/>
				</Form.Control>
			</Form.Field>
		</Form.Join>

		<Form.Join class="flex-auto gap-2 lg:flex-none">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Form.Button
						builders={[builder]}
						aria-label={sending ? 'Cancel Request' : 'Send Request'}
						class="flex-1 sm:w-24"
						on:click={() => (action = sending ? 'cancel' : 'send')}
					>
						<span>{sending ? 'Cancel' : 'Send'}</span>
					</Form.Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="top" class="select-none">
					<Shortcut.Root>
						<span class="mr-4">Send request</span>
						{#each SHORTCUTS.send.modifier as modifier}
							<Shortcut.Key>{modifier}</Shortcut.Key>
						{/each}
						<Shortcut.Key>{@html UNICODES[SHORTCUTS.send.key]}</Shortcut.Key>
					</Shortcut.Root>
				</Tooltip.Content>
			</Tooltip.Root>

			<Form.Join class="flex-none">
				<Tooltip.Root>
					<Tooltip.Trigger asChild let:builder>
						<Form.Button
							builders={[builder]}
							variant="secondary"
							aria-label="Save Request"
							class="rounded-r-none"
							on:click={() => (action = 'save')}
						>
							<Save class="mr-2 h-4 w-4" />
							<span>Save</span>
						</Form.Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="top" class="select-none">
						<Shortcut.Root>
							<span class="mr-4">Save</span>
							{#each SHORTCUTS.save.modifier as modifier}
								<Shortcut.Key>{modifier}</Shortcut.Key>
							{/each}
							<Shortcut.Key>{SHORTCUTS.save.key}</Shortcut.Key>
						</Shortcut.Root>
					</Tooltip.Content>
				</Tooltip.Root>

				<PopoverSaveOptions {tabID} let:builder={popoverBuilder}>
					<Tooltip.Root>
						<Tooltip.Trigger asChild let:builder={tooltipBuilder}>
							<Button
								builders={[popoverBuilder, tooltipBuilder]}
								size="icon"
								variant="secondary"
								aria-label="Options"
								class="rounded-l-none"
							>
								<ChevronDown class="h-4 w-4" />
								<span class="sr-only">Options</span>
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content side="top" class="select-none">
							<span>Options</span>
						</Tooltip.Content>
					</Tooltip.Root>
				</PopoverSaveOptions>
			</Form.Join>
		</Form.Join>
	</Form.Join>

	<Form.Join class="h-full">
		<Tabs.Root value={currentTab} class="flex flex-1 flex-col">
			<div class="sticky top-[7.5rem] flex shrink-0 flex-col lg:top-[4.5rem]">
				<Tabs.List class="flex !h-auto shrink-0 gap-8 bg-background px-4 py-0">
					{#each LAZY_TABS as { value, label, disabled }}
						<Tabs.Trigger
							{value}
							{disabled}
							aria-label="{label} Tab"
							class="relative gap-2 px-0 py-2 text-muted-foreground !shadow-none before:absolute before:inset-x-0 before:bottom-0 before:h-[.125rem] before:bg-transparent before:transition-colors data-[state=active]:text-accent-foreground data-[state=active]:before:bg-primary hover:text-accent-foreground"
							on:click={() => handleCurrentTab(value)}
						>
							<span class="capitalize">{label}</span>
							{#if dynamicCounters[value]}
								<span
									class="bg-accent-background inline-flex h-4 min-w-4 items-center justify-center rounded-md border border-border px-1 text-[8px] leading-normal text-muted-foreground"
								>
									{dynamicCounters[value]}
								</span>
							{/if}
						</Tabs.Trigger>
					{/each}
				</Tabs.List>

				<Separator orientation="horizontal" />
			</div>

			{#each LAZY_TABS as { value, content }}
				<Tabs.Content {value} class="m-0 h-full w-full">
					{#await content}
						<Spinner />
					{:then module}
						<svelte:component this={module.default} {tabID} {form} />
					{/await}
				</Tabs.Content>
			{/each}
		</Tabs.Root>
	</Form.Join>
</form>
