<script lang="ts" context="module">
	import { getRESTStore, getRESTTabStore } from '$lib/stores';
	import {
		RESTRequestSchema,
		MethodEnum,
		type TRESTRequestInfer,
		type TRESTTabInfer
	} from '$lib/validators';
	import { PopoverSaveOptions } from '$lib/layouts/rest';
	import { Button } from '$lib/components/ui/button';
	import * as Shortcut from '$lib/components/ui/shortcut';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Form from '$lib/components/ui/form';
	import { RESPONSE_TYPES, SHORTCUTS, UNICODES } from '$lib/maps';
	import { ChevronDown, Save } from 'lucide-svelte';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import type { ComponentProps } from 'svelte';

	type TFormAction = 'send' | 'cancel' | 'save';
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id'] };

	export let tabID: $$Props['tabID'];
	let tab: TRESTTabInfer;

	const [restStore, tabStore] = [getRESTStore(), getRESTTabStore()];
	const { options: methodOptions } = MethodEnum;

	let action: TFormAction = 'send';
	let controller = new AbortController();

	const superFrm = superForm(defaults(zod(RESTRequestSchema)), {
		id: `tab-request-${tabID}`,
		SPA: true,
		validators: zod(RESTRequestSchema),
		validationMethod: 'onblur',
		resetForm: false,
		onSubmit: handleFormSubmit
	});

	$: ({ form: formValue, formId, submitting } = superFrm);
	$: sending = $tabStore.results.find((result) => result.id === tabID)?.sending;
	$: if ($tabStore.tabs) {
		tab = tabStore.get(tabID) as TRESTTabInfer;
		if (tab) $formValue = tab.context;
	}

	function handleOnChange() {
		tabStore.update(tabID, $formValue);
		tabStore.setDirty([tabID], true);
	}

	function handleOnSelectedChange(selected: ComponentProps<Form.Select>['selected']) {
		const method = selected?.value as TRESTRequestInfer['method'];
		tabStore.update(tabID, { method });
		tabStore.setDirty([tabID], true);
	}

	function handleKeydown(event: KeyboardEvent) {
		if ($tabStore.current !== tabID) return;

		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
			event.preventDefault();
			if ($submitting) return;

			action = sending ? 'cancel' : 'send';
			$formId && document.forms.namedItem($formId)?.requestSubmit();
		}
	}

	function handleFormSubmit() {
		const ACTIONS: Record<TFormAction, () => void> = {
			send: () => {
				tabStore.setResult(tabID, { response: undefined, sending: true });

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
											tabStore.setResult(tabID, {
												response: { ok, status, headers, blob, json, time, raw }
											})
									);
								} else {
									response
										.clone()
										.text()
										.then((raw) =>
											tabStore.setResult(tabID, {
												response: { ok, status, headers, blob, time, raw }
											})
										);
								}
							});
					})
					.catch((error) => {
						const isDOMException = error instanceof DOMException;
						tabStore.setResult(tabID, { response: isDOMException ? undefined : error });
					})
					.finally(() => tabStore.setResult(tabID, { sending: false }));
			},
			cancel: async () => {
				controller.abort();
				controller = new AbortController();
			},
			save: () => {
				restStore.updateFile($formValue as TRESTRequestInfer);
				tabStore.update(tabID, $formValue);
				tabStore.setDirty([tabID], false);
			}
		};

		return ACTIONS[action]();
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<Form.Root
	id={$formId}
	form={superFrm}
	schema={RESTRequestSchema}
	controlled
	action="?/{action}"
	let:config
	on:change={handleOnChange}
	class="sticky top-0 z-20"
>
	<Form.Join class="flex flex-col gap-2 sm:flex-row">
		<Form.Join class="min-w-[12rem] whitespace-nowrap">
			<Form.Field {config} name="method">
				<Form.Item class="w-32">
					<Form.Select
						selected={{ value: $formValue.method, label: $formValue.method }}
						onSelectedChange={handleOnSelectedChange}
					>
						<Form.SelectTrigger
							class="relative rounded-l-md rounded-r-none bg-input font-semibold focus:z-10"
						/>
						<Form.SelectContent>
							{#each methodOptions as method}
								{@const methodLowCase = method.toLowerCase()}

								<Form.SelectItem value={method} style="color: var(--method-{methodLowCase}-color)">
									{method}
								</Form.SelectItem>
							{/each}
						</Form.SelectContent>
					</Form.Select>
				</Form.Item>
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

		<Form.Join class="flex-none gap-2">
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
</Form.Root>
