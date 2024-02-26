<script lang="ts" context="module">
	import { getRESTContext, getRESTTabContext } from '$lib/contexts';
	import {
		RESTRequestSchema,
		MethodEnum,
		type TRESTRequestInfer,
		type TRESTTabInfer
	} from '$lib/validators';
	import { PopoverSaveOptions, dialogSaveAsStore as dialogStore } from '$lib/layouts/rest';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { Spinner } from '$lib/components/ui/spinner';
	import * as Shortcut from '$lib/components/ui/shortcut';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Form from '$lib/components/ui/form';
	import * as Tabs from '$lib/components/ui/tabs';
	import { RESPONSE_TYPES, SHORTCUTS, UNICODES } from '$lib/maps';
	import { ChevronDown, Save } from 'lucide-svelte';
	import { defaults, superForm, type SuperForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { ComponentProps } from 'svelte';

	type TFormAction = 'send' | 'cancel' | 'save';
	type TTab = {
		value: string;
		content: Promise<any>;
		disabled?: boolean;
	};
	type TAvailableTabs = (typeof LAZY_TABS)[number]['value'];

	const LAZY_TABS = [
		{
			value: 'parameters',
			content: import('$lib/layouts/rest/tabs/tab-params'),
			disabled: false
		}
		// {
		// 	value: 'body',
		// 	content: import('$lib/layouts/rest/tabs/tab-collections'),
		// 	disabled: true
		// },
		// {
		// 	value: 'headers',
		// 	content: import('$lib/layouts/rest/tabs/tab-collections'),
		// 	disabled: true
		// },
		// {
		// 	value: 'authorization',
		// 	content: import('$lib/layouts/rest/tabs/tab-collections'),
		// 	disabled: true
		// }
	] as const satisfies Array<TTab>;
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id'] };

	export let tabID: $$Props['tabID'];

	const [restContext, tabContext] = [getRESTContext(), getRESTTabContext()];
	const { options: methodOptions } = MethodEnum;

	let tab: TRESTTabInfer;
	let action: TFormAction = 'send';
	let controller = new AbortController();
	let currentTab: TAvailableTabs = 'parameters';

	const form = superForm(defaults(zod(RESTRequestSchema)), {
		id: `tab-request-${tabID}`,
		SPA: true,
		dataType: 'json',
		validators: zod(RESTRequestSchema),
		validationMethod: 'onblur',
		resetForm: false,
		onSubmit: handleFormSubmit
	}) as SuperForm<TRESTRequestInfer>;

	$: ({ form: formValue, formId, submitting } = form);
	$: sending = $tabContext.results.find((result) => result.id === tabID)?.sending;
	$: if ($tabContext.tabs) {
		tab = tabContext.get(tabID) as TRESTTabInfer;
		if (tab) $formValue = tab.context;
	}

	function handleCurrentTab(value: TAvailableTabs) {
		currentTab = value;
	}

	function handleOnChange() {
		tabContext.update(tabID, $formValue);
		tabContext.setDirty([tabID], true);
	}

	function handleOnSelectedChange(selected: { value: any }) {
		const method = selected?.value as TRESTRequestInfer['method'];
		tabContext.update(tabID, { method });
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
			$formId && document.forms.namedItem($formId)?.requestSubmit();
		}

		if ((event.ctrlKey || event.metaKey) && event.key === 's') {
			event.preventDefault();

			action = 'save';
			$formId && document.forms.namedItem($formId)?.requestSubmit();
		}
	}

	function handleFormSubmit() {
		const ACTIONS: Record<TFormAction, () => void> = {
			send: () => {
				tabContext.setResult(tabID, { response: undefined, sending: true });

				const { url, method } = $formValue;
				const start = performance.now();

				fetch(url, { method, signal: controller.signal })
					.then((response) => {
						const end = performance.now();
						const time = end - start;
						const { ok, status, headers } = response;

						response
							.clone()
							.blob()
							.then((blob) => {
								if (!RESPONSE_TYPES.includes(blob.type as (typeof RESPONSE_TYPES)[number])) return;

								if (blob.type === 'application/json') {
									Promise.all([response.clone().json(), response.clone().text()]).then(
										([json, raw]) =>
											tabContext.setResult(tabID, {
												response: { ok, status, headers, blob, json, time, raw }
											})
									);
								} else {
									response
										.clone()
										.text()
										.then((raw) =>
											tabContext.setResult(tabID, {
												response: { ok, status, headers, blob, time, raw }
											})
										);
								}
							});
					})
					.catch((error) => {
						const isDOMException = error instanceof DOMException;
						tabContext.setResult(tabID, { response: isDOMException ? undefined : error });
					})
					.finally(() => tabContext.setResult(tabID, { sending: false }));
			},
			cancel: async () => {
				controller.abort();
				controller = new AbortController();
			},
			save: () => {
				const data = $formValue as TRESTRequestInfer;
				const found = restContext.getFile(tabID);

				const updateTab = () => {
					tabContext.update(tabID, $formValue);
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
		};

		return ACTIONS[action]();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<Form.Root id={$formId} action="?/{action}" on:change={handleOnChange}>
	<Form.Join class="sticky top-0 z-20 flex flex-wrap gap-2">
		<Form.Join class="min-w-[12rem] flex-auto whitespace-nowrap lg:flex-1">
			<Form.Field {form} name="method">
				<Form.Control let:attrs>
					<Form.Select
						selected={{ value: $formValue.method, label: $formValue.method }}
						onSelectedChange={handleOnSelectedChange}
					>
						<Form.SelectTrigger
							class="relative rounded-l-md rounded-r-none bg-input font-semibold focus:z-10"
						/>
						<Form.SelectContent>
							{#each methodOptions as method}
								<Form.SelectItem
									value={method}
									style="color: hsl(var(--method-{method.toLowerCase()}-color) / var(--tw-text-opacity))"
								>
									{method}
								</Form.SelectItem>
							{/each}
						</Form.SelectContent>
					</Form.Select>
				</Form.Control>
			</Form.Field>

			<Form.Field {config} name="url">
				<Form.Item class="flex-1">
					<Form.Input
						type="url"
						placeholder="URL"
						class="relative rounded-l-none rounded-r-md border-none bg-input focus:z-10"
					/>
				</Form.Item>
			</Form.Field>
		</Form.Join>

		<Form.Join class="flex-auto gap-2 lg:flex-none">
			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Form.Button
						builders={[builder]}
						type="submit"
						class="flex-1 sm:w-24"
						on:click={() => (action = sending ? 'cancel' : 'send')}
					>
						{#if sending}
							Cancel
						{:else}
							Send
						{/if}
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
							type="submit"
							variant="secondary"
							class="rounded-r-none"
							on:click={() => (action = 'save')}
						>
							<Save class="mr-2 h-4 w-4" />
							Save
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
								class="rounded-l-none"
							>
								<ChevronDown class="h-4 w-4" />
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

	<Form.Join class="-mx-4 mt-4">
		<Tabs.Root class="relative flex flex-1 flex-col">
			<Tabs.List class="flex flex-1 gap-8 bg-background px-4 py-0">
				{#each LAZY_TABS as { value, disabled }}
					<Tabs.Trigger
						{value}
						{disabled}
						class="relative px-0 py-2 text-muted-foreground !shadow-none before:absolute before:inset-x-0 before:bottom-0 before:h-[.125rem] before:bg-transparent before:transition-colors data-[state=active]:text-accent-foreground data-[state=active]:before:bg-primary hover:text-accent-foreground"
						on:click={() => handleCurrentTab(value)}
					>
						<span class="capitalize">{value}</span>
					</Tabs.Trigger>
				{/each}
			</Tabs.List>

			<Separator orientation="horizontal" />

			{#each LAZY_TABS as { value, content }}
				<Tabs.Content {value} class="m-0 w-full">
					{#await content}
						<Spinner />
					{:then module}
						<svelte:component this={module.default} {form} />
					{/await}
				</Tabs.Content>
			{/each}
		</Tabs.Root>
	</Form.Join>
</Form.Root>
