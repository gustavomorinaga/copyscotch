<script lang="ts" context="module">
	import { getRESTStore, getRESTTabStore } from '$lib/stores';
	import { generateUUID } from '$lib/utils';
	import {
		RESTRequestSchema,
		type TRESTRequestInfer,
		type TRESTTabInfer,
		type TRESTRequestSchema
	} from '$lib/validators';
	import * as Form from '$lib/components/ui/form';
	import { Save } from 'lucide-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ComponentProps } from 'svelte';

	type TFormAction = 'send' | 'cancel' | 'save';
</script>

<script lang="ts">
	import { Join } from '$lib/components/ui/form';

	type $$Props = {
		tabID: TRESTTabInfer['id'];
		form: SuperValidated<TRESTRequestSchema>;
	};

	export let tabID: $$Props['tabID'];
	export let form: $$Props['form'];

	const restStore = getRESTStore();
	const tabStore = getRESTTabStore();

	const formID = generateUUID();
	const { context: request } = tabStore.get(tabID) as TRESTTabInfer;
	const uniqueForm = { ...structuredClone(form), id: formID, data: request };
	const methodOptions = RESTRequestSchema.shape.method.options;

	let formAction: TFormAction = 'send';
	let controller = new AbortController();

	const superFrm = superForm(uniqueForm, {
		SPA: true,
		validators: RESTRequestSchema,
		validationMethod: 'onblur',
		taintedMessage: false,
		onSubmit: async () => {
			const formActions = {
				send: async () => {
					tabStore.setResult(tabID, { response: undefined, sending: true });

					const { url, method } = $formValue;
					const start = performance.now();

					fetch(url, { method: method, signal: controller.signal })
						.then((response) => {
							const end = performance.now();
							const time = end - start;
							const { ok, status, headers } = response;

							Promise.all([response.clone().json(), response.clone().blob()]).then(([json, blob]) =>
								tabStore.setResult(tabID, {
									response: { ok, status, headers, json, blob, time }
								})
							);
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
				save: async () => {
					restStore.saveRequests([$formValue]);
					tabStore.update(tabID, $formValue);
					// tabStore.setDirty([tabID], false);
				}
			} as Record<TFormAction, () => Promise<void>>;

			return await formActions[formAction]();
		}
	});

	$: ({ form: formValue, submitting } = superFrm);
	$: sending = $tabStore.results.find((result) => result.id === tabID)?.sending;
	$: if ($tabStore.tabs) {
		const updatedTab = tabStore.get(tabID);
		if (updatedTab) $formValue = updatedTab.context;
	}

	function onChange() {
		tabStore.update(tabID, $formValue);
		tabStore.setDirty([tabID], true);
	}

	function onSelectedChange(selected: ComponentProps<Form.Select>['selected']) {
		const method = selected?.value as TRESTRequestInfer['method'];
		tabStore.update(tabID, { method });
		tabStore.setDirty([tabID], true);
	}

	function handleKeydown(event: KeyboardEvent) {
		if ($tabStore.current !== tabID) return;

		if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
			event.preventDefault();
			if ($submitting) return;

			formAction = sending ? 'cancel' : 'send';
			document.forms.namedItem(formID)?.requestSubmit();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<Form.Root
	id={formID}
	form={superFrm}
	schema={RESTRequestSchema}
	controlled
	action="?/{formAction}"
	let:config
	on:change={onChange}
	class="sticky top-0 z-20"
>
	<Form.Join class="flex flex-col gap-2 sm:flex-row">
		<Form.Join class="min-w-[12rem] whitespace-nowrap">
			<Form.Field {config} name="method">
				<Form.Item class="w-32">
					<Form.Select
						selected={{ value: $formValue.method, label: $formValue.method }}
						onSelectedChange={(value) => onSelectedChange(value)}
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
			<Form.Button
				type="submit"
				class="flex-1 sm:w-24"
				on:click={() => (formAction = sending ? 'cancel' : 'send')}
			>
				{#if sending}
					Cancel
				{:else}
					Send
				{/if}
			</Form.Button>

			<Form.Button type="submit" variant="secondary" on:click={() => (formAction = 'save')}>
				<Save class="mr-2 h-4 w-4" />
				Save
			</Form.Button>
		</Form.Join>
	</Form.Join>
</Form.Root>
