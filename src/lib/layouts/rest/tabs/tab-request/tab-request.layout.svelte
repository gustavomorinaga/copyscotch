<script lang="ts" context="module">
	import { getRESTTabStore } from '$lib/stores';
	import { generateUUID } from '$lib/utils';
	import {
		editRequestSchema as schema,
		type TRESTRequestSchema,
		type TRESTRequestInfer
	} from '$lib/validators';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ComponentProps } from 'svelte';

	type TFormAction = 'send' | 'cancel';
</script>

<script lang="ts">
	type $$Props = {
		requestID: TRESTRequestInfer['id'];
		form: SuperValidated<TRESTRequestSchema>;
	};

	export let form: $$Props['form'];
	export let requestID: $$Props['requestID'];

	const tabStore = getRESTTabStore();
	$: ({ tabs } = $tabStore);

	const formID = generateUUID();
	const request = tabStore.get(requestID) as TRESTRequestInfer;
	const uniqueForm = { ...structuredClone(form), id: formID, data: request };
	const methodOptions = schema.shape.method.options;

	let sending = false;
	let controller = new AbortController();

	const superFrm = superForm(uniqueForm, {
		SPA: true,
		validators: schema,
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

	$: ({ form: formValue } = superFrm);
	$: formAction = (sending ? 'cancel' : 'send') as TFormAction;
	$: if (tabs) {
		const updatedRequest = tabStore.get(requestID);
		if (updatedRequest) $formValue = updatedRequest;
	}

	function onChange() {
		tabStore.update(requestID, $formValue);
	}

	function onSelectedChange(selected: ComponentProps<Form.Select>['selected']) {
		tabStore.update(requestID, {
			method: selected?.value as TRESTRequestInfer['method']
		});
	}
</script>

<Form.Root
	id={formID}
	form={superFrm}
	{schema}
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
							class="relative bg-input rounded-l-md rounded-r-none font-semibold focus:z-10"
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
						class="relative border-none bg-input rounded-l-none rounded-r-md focus:z-10"
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
