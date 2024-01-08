<script lang="ts" context="module">
	import { getRESTStore } from '$lib/stores';
	import * as Form from '$lib/components/ui/form';
	import {
		editRequestSchema as schema,
		type TRESTEditRequestSchema,
		type TRESTRequestSchemaType
	} from '$lib/validators';
	import { superForm } from 'sveltekit-superforms/client';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ComponentProps } from 'svelte';
</script>

<script lang="ts">
	type $$Props = {
		requestID: TRESTRequestSchemaType['id'];
		form: SuperValidated<TRESTEditRequestSchema>;
	};

	export let form: $$Props['form'];
	export let requestID: $$Props['requestID'];

	const restStore = getRESTStore();
	const formID = `edit-${requestID}`;

	const index = $restStore.requests.findIndex(({ id }) => id === requestID);
	const request = $restStore.requests[index];
	const uniqueForm = { ...structuredClone(form), id: formID, data: request };
	const methodOptions = schema.shape.method.options;

	let sending = false;

	const superFrm = superForm(uniqueForm, {
		validators: schema,
		validationMethod: 'onblur',
		taintedMessage: false,
		onSubmit: () => {
			sending = true;
			onSend().finally(() => (sending = false));
		}
	});

	$: ({ form: formValue } = superFrm);

	function onChange() {
		restStore.updateRequest(requestID, $formValue);
	}

	function onSelectedChange(selected: ComponentProps<Form.Select>['selected']) {
		restStore.updateRequest(requestID, {
			method: selected?.value as TRESTRequestSchemaType['method']
		});
	}

	async function onSend() {
		const { url, method } = $formValue;
		const response = await fetch(url, { method });

		return response;
	}
</script>

<Form.Root form={superFrm} {schema} controlled let:config on:change={onChange} class="px-2">
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
