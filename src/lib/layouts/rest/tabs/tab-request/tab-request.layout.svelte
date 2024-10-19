<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import ChevronDown from 'lucide-svelte/icons/chevron-down';
	import Save from 'lucide-svelte/icons/save';
	import { type ChangeEvent, type SuperForm, defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { getRESTContext, getRESTTabContext } from '$lib/contexts/rest';
	import {
		MethodEnum,
		RESTRequestSchema,
		RequestTabsEnum,
		type TKeyValueMapped,
		type TRESTRequestInfer,
		type TRESTTabInfer
	} from '$lib/validators';
	import { fetcher } from '$lib/functions/fetcher';
	import { dialogSaveAsStore as dialogStore } from '$lib/layouts/rest/dialogs/dialog-save-as';
	import { PopoverSaveOptions } from '$lib/layouts/rest/popovers/popover-save-options';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Spinner } from '$lib/components/ui/spinner';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import * as Shortcut from '$lib/components/ui/shortcut';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Select from '$lib/components/ui/select';
	import * as Form from '$lib/components/ui/form';
	import * as Tabs from '$lib/components/ui/tabs';
	import { REGEXES, SHORTCUTS, UNICODES } from '$lib/maps';
	import type { TTab } from '$lib/ts';

	type TFormAction = 'send' | 'cancel' | 'save';
	type TAvailableTabs = (typeof RequestTabsEnum.options)[number];

	const { options: methodOptions } = MethodEnum;

	const LAZY_TABS = [
		{
			value: 'params',
			label: 'parameters',
			content: import('$lib/layouts/rest/tabs/tab-params').then((module) => module.TabParams),
			disabled: false
		},
		{
			value: 'body',
			label: 'body',
			content: import('$lib/layouts/rest/tabs/tab-body').then((module) => module.TabBody),
			disabled: false
		},
		{
			value: 'headers',
			label: 'headers',
			content: import('$lib/layouts/rest/tabs/tab-headers').then((module) => module.TabHeaders),
			disabled: false
		}
	] as const satisfies Array<TTab>;
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id'] };

	export let tabID: $$Props['tabID'];
	const formID: string = `tab-request-${tabID}`;

	const [restContext, tabContext] = [getRESTContext(), getRESTTabContext()];

	let tab!: TRESTTabInfer;
	let currentTab!: TAvailableTabs;
	let action: TFormAction = 'send';
	let controller = new AbortController();
	let toolbarRef!: HTMLElement;

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
		tab = tabContext.getTab(tabID) as TRESTTabInfer;
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
		tabContext.setCurrentInnerTab(tabID, value);
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

			tabContext.updateTab(tabID, request);
		}

		tabContext.setDirtyTabs([tabID], true);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (!$tabContext.current) return;
		if ($tabContext.current !== tabID) return;

		if (event.ctrlKey && event.key === 'Enter') {
			event.preventDefault();
			if ($submitting) return;

			action = sending ? 'cancel' : 'send';
			document.forms.namedItem(formID)?.requestSubmit();
		}

		if (event.ctrlKey && event.key === 's') {
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
		if (!$formData.url && !$formData.method) return;

		tabContext.setResult(tabID, { response: undefined, sending: true });

		const url = new URL($formData.url);
		let params: TKeyValueMapped = {};
		let headers: TKeyValueMapped = {};
		let body: BodyInit | null = null;

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

		if ($formData.body.body) {
			if ($formData.body.contentType) body = $formData.body.body;
			const hasOverride = activeHeaders.some(({ key }) => key.toLowerCase() === 'content-type');
			if (!hasOverride) headers['content-type'] = $formData.body.contentType || 'text/plain';
		}

		fetcher(url, { method: $formData.method, headers, body, signal: controller.signal })
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
		const found = restContext.getFile(tabID);
		if (found && !tab.dirty) return;

		const data = $formData as TRESTRequestInfer;

		const updateTab = () => {
			tabContext.updateTab(tabID, $formData);
			tabContext.setDirtyTabs([tabID], false);
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

	onMount(() => {
		toolbarRef = document.getElementById('main-request-toolbar') as HTMLElement;
	});
</script>

<svelte:window on:keydown={handleKeydown} />

<form
	id={formID}
	method="POST"
	action="?/{action}"
	class="relative flex h-full w-full flex-1 flex-col"
	use:enhance
>
	<Form.Join
		id="main-request-toolbar"
		class="sticky top-0 z-20 flex-initial shrink-0 flex-wrap gap-2 bg-background p-4"
	>
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
						<span class="select-none capitalize">{sending ? 'Cancel' : 'Send'}</span>
					</Form.Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="top" class="select-none">
					<Shortcut.Root>
						<span class="mr-4">Send request</span>
						{#each SHORTCUTS.send.modifier as modifier}
							<Shortcut.Key>{modifier}</Shortcut.Key>
						{/each}
						<Shortcut.Key>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html UNICODES[SHORTCUTS.send.key]}
						</Shortcut.Key>
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
							<Save class="mr-2 h-4 w-4 shrink-0" />
							<span class="select-none">Save</span>
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
								<ChevronDown class="h-4 w-4 shrink-0" />
								<span class="sr-only select-none">Options</span>
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
			<div
				class="sticky flex shrink-0 flex-col lg:top-[4.5rem] {toolbarRef?.offsetHeight > 100
					? 'top-[7.5rem]'
					: 'top-[4.5rem]'}"
			>
				<Tabs.List class="flex !h-auto shrink-0 gap-8 bg-background px-4 py-0">
					{#each LAZY_TABS as { value, label, disabled }}
						<Tabs.Trigger
							{value}
							{disabled}
							aria-label="{label} Tab"
							class="relative gap-2 px-0 py-2 text-muted-foreground !shadow-none before:absolute before:inset-x-0 before:bottom-0 before:h-[.125rem] before:bg-transparent before:transition-colors data-[state=active]:text-accent-foreground data-[state=active]:before:bg-primary hover:text-accent-foreground"
							on:click={() => handleCurrentTab(value)}
						>
							<span class="select-none capitalize">{label}</span>
							{#if dynamicCounters[value]}
								<Badge size="sm" variant="outline" class="!text-foreground">
									{dynamicCounters[value]}
								</Badge>
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
						<svelte:component this={module} {tabID} {form} />
					{/await}
				</Tabs.Content>
			{/each}
		</Tabs.Root>
	</Form.Join>
</form>
