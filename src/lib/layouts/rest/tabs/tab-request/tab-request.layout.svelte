<script lang="ts" context="module">
	import { getRESTStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import {
		mainRequestSchema,
		type TRESTRequestSchema,
		type TRESTRequestSchemaType
	} from '$lib/validators';
	import type { SuperValidated } from 'sveltekit-superforms';
</script>

<script lang="ts">
	type $$Props = {
		form: SuperValidated<TRESTRequestSchema>;
		requestID: TRESTRequestSchemaType['id'];
	};

	export let form: $$Props['form'];
	export let requestID: $$Props['requestID'];

	const restStore = getRESTStore();
	let index = $restStore.requests.findIndex(({ id }) => id === requestID);
	let request = $restStore.requests[index];
</script>

<!-- <form method="POST" action="?/send" class="flex py-2 px-4 items-center space-x-2">
	<Input type="url" id="url" name="url" bind:value={request.url} />
	<Button type="submit">Send</Button>
</form> -->

<Form.Root method="POST" action="?/send" {form} schema={mainRequestSchema} let:config class="px-2">
	<Form.Join class="w-full gap-2">
		<Form.Field {config} name="url">
			<Form.Item class="grow">
				<Form.Input type="url" placeholder="URL" />
			</Form.Item>
		</Form.Field>

		<Form.Button>Send</Form.Button>
	</Form.Join>
</Form.Root>
