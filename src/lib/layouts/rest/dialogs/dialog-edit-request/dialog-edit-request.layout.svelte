<script lang="ts" context="module">
	import { getRESTStore } from '$lib/stores';
	import { editRequestSchema as schema, type TRESTEditRequestSchema } from '$lib/validators';
	import { Button } from '$lib/components/ui/button';
	import * as Form from '$lib/components/ui/form';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { TRESTRequest } from '$lib/ts';
	import type { SuperValidated } from 'sveltekit-superforms';
</script>

<script lang="ts">
	type $$Props = Dialog.Props & {
		form: SuperValidated<TRESTEditRequestSchema>;
		requestID: TRESTRequest['id'];
	};

	export let form: $$Props['form'];
	export let requestID: $$Props['requestID'];
	export let open: $$Props['open'] = false;

	const restStore = getRESTStore();
	const formID = `main-${requestID}`;
	let index = $restStore.requests.findIndex(({ id }) => id === requestID);
	let request = $restStore.requests[index];

	function onDblClick() {
		open = true;
	}

	function onCancel() {
		request.name = $restStore.requests[index].name;
		open = false;
	}

	function onSave() {
		$restStore.requests[index].name = request.name;
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger asChild>
		<div role="presentation" tabindex="-1" on:dblclick={onDblClick}>
			<slot name="trigger" />
		</div>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit Request</Dialog.Title>
		</Dialog.Header>

		<Form.Root {form} {schema} options={{ id: formID, SPA: true }} let:config>
			<Form.Field {config} name="name">
				<Form.Item>
					<Form.Label for="name">Name</Form.Label>
					<Form.Input type="text" id="name" name="name" />
				</Form.Item>
			</Form.Field>
		</Form.Root>

		<Dialog.Footer>
			<Button type="submit" variant="ghost" on:click={onCancel}>Cancel</Button>
			<Button type="submit" variant="default" on:click={onSave}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
