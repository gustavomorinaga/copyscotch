<script lang="ts" context="module">
	import { getRESTTabStore } from '$lib/stores';
	import { generateUUID } from '$lib/utils';
	import {
		RESTRequestSchema,
		type TRESTRequestInfer,
		type TRESTTabInfer,
		type TRESTRequestSchema
	} from '$lib/validators';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ComponentProps } from 'svelte';

	type TFormAction = 'send' | 'cancel';
</script>

<script lang="ts">
	type $$Props = {
		tabID: TRESTTabInfer['id'];
		form: SuperValidated<TRESTRequestSchema>;
	};

	export let tabID: $$Props['tabID'];
	export let form: $$Props['form'];

	const tabStore = getRESTTabStore();
	$: ({ tabs } = $tabStore);

	const formID = generateUUID();
	const { context: request } = tabStore.get(tabID) as TRESTTabInfer;
	const uniqueForm = { ...structuredClone(form), id: formID, data: request };
	const methodOptions = RESTRequestSchema.shape.method.options;

	let sending = false;
	let controller = new AbortController();

	const superFrm = superForm(uniqueForm, {
		SPA: true,
		validators: RESTRequestSchema,
		validationMethod: 'onblur',
		taintedMessage: false,
		onSubmit: async (input) => {
			const actionMap = {
				send: async () => {
					sending = true;
					const { url, method } = $formValue;
					fetch(url, { method: method, signal: controller.signal }).finally(
						() => (sending = false)
					);
				},
				cancel: async () => {
					sending = false;
					input.cancel();
					controller.abort();
					controller = new AbortController();
				}
			} as Record<TFormAction, () => Promise<void>>;

			return await actionMap[formAction]();
		}
	});

	$: ({ form: formValue, tainted } = superFrm);
	$: formAction = (sending ? 'cancel' : 'send') as TFormAction;
	$: tabStore.setDirty(tabID, Boolean($tainted));
	$: if (tabs) {
		const updatedTab = tabStore.get(tabID);
		if (updatedTab) $formValue = updatedTab.context;
	}

	function onChange() {
		tabStore.update(tabID, $formValue);
	}

	function onSelectedChange(selected: ComponentProps<Form.Select>['selected']) {
		tabStore.update(tabID, {
			method: selected?.value as TRESTRequestInfer['method']
		});
	}
</script>

<Form.Root
	id={formID}
	form={superFrm}
	schema={RESTRequestSchema}
	controlled
	action="?/{formAction}"
	let:config
	on:change={onChange}
>
	<Form.Join class="w-full gap-2">
		<Form.Join class="w-full">
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
				<Form.Item class="grow">
					<Form.Input
						type="url"
						placeholder="URL"
						class="relative rounded-l-none rounded-r-md border-none bg-input focus:z-10"
					/>
				</Form.Item>
			</Form.Field>
		</Form.Join>

		<Form.Button type="submit" class="w-24">
			{#if sending}
				Cancel
			{:else}
				Send
			{/if}
		</Form.Button>
	</Form.Join>
</Form.Root>
