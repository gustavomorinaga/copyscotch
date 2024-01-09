<script lang="ts" context="module">
	import { getRESTStore } from '$lib/stores';
	import { randomID } from '$lib/utils';
	import {
		editRequestSchema as schema,
		type TRESTRequestSchema,
		type TRESTRequestSchemaInfer
	} from '$lib/validators';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ComponentProps } from 'svelte';
</script>

<script lang="ts">
	type $$Props = {
		requestID: TRESTRequestSchemaInfer['id'];
		form: SuperValidated<TRESTRequestSchema>;
	};

	export let form: $$Props['form'];
	export let requestID: $$Props['requestID'];

	const restStore = getRESTStore();
	const formID = randomID();

	const request = restStore.getRequest(requestID) as TRESTRequestSchemaInfer;
	const uniqueForm = { ...structuredClone(form), id: formID, data: request };
	const methodOptions = schema.shape.method.options;

	let sending = false;

	const superFrm = superForm(uniqueForm, {
		validators: schema,
		validationMethod: 'onblur',
		taintedMessage: false,
		onSubmit: async () => {
			sending = true;
			await onSend().finally(() => (sending = false));
		}
	});

	$: ({ form: formValue } = superFrm);

	function onChange() {
		restStore.updateRequest(requestID, $formValue);
	}

	function onSelectedChange(selected: ComponentProps<Form.Select>['selected']) {
		restStore.updateRequest(requestID, {
			method: selected?.value as TRESTRequestSchemaInfer['method']
		});
	}

	async function onSend() {
		const { url, method } = $formValue;
		const response = await fetch(url, { method });

		return response;
	}
</script>

<Form.Root form={superFrm} {schema} controlled let:config on:change={onChange}>
	<Form.Join class="w-full gap-2">
		<Form.Join class="w-full">
			<Form.Field {config} name="method">
				<Form.Item class="w-32">
					<Form.Select
						selected={{ value: $formValue.method, label: $formValue.method }}
						onSelectedChange={(value) => onSelectedChange(value)}
					>
						<Form.SelectTrigger
							class="relative bg-input font-semibold rounded-l-md rounded-r-none focus:z-10"
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

		<Form.Button type="submit" disabled={sending}>
			{#if sending}
				Cancel
			{:else}
				Send
			{/if}
		</Form.Button>
	</Form.Join>
</Form.Root>
