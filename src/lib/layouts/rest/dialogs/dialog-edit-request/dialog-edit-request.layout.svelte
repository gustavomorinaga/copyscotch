<script lang="ts" context="module">
	import { getRESTStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { TRESTRequest } from '$lib/ts';
</script>

<script lang="ts">
	type $$Props = Dialog.Props & {
		requestID: TRESTRequest['id'];
		trigger?: Dialog.TriggerProps;
		openOnDblClick?: boolean;
	};

	export let requestID: $$Props['requestID'];
	export let open: $$Props['open'] = false;
	export let trigger: $$Props['trigger'] = undefined;
	export let openOnDblClick: $$Props['openOnDblClick'] = false;

	if (openOnDblClick) trigger = { ...trigger, asChild: true };

	const restStore = getRESTStore();
	let index = $restStore.requests.findIndex(({ id }) => id === requestID);
	let name = $restStore.requests[index].name;

	function onDblClick() {
		if (openOnDblClick) open = true;
	}

	function onCancel() {
		name = $restStore.requests[index].name;
		open = false;
	}

	function onSave() {
		$restStore.requests[index].name = name;
		open = false;
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger {...trigger} let:builder>
		{#if openOnDblClick}
			<div role="presentation" tabindex="-1" on:dblclick={onDblClick}>
				<slot name="trigger" {builder} />
			</div>
		{:else}
			<slot name="trigger" {builder} />
		{/if}
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Edit Request</Dialog.Title>
		</Dialog.Header>

		<div>
			<Label for="name">Name</Label>
			<Input type="text" id="name" bind:value={name} />
		</div>

		<Dialog.Footer>
			<Button variant="ghost" on:click={onCancel}>Cancel</Button>
			<Button variant="default" on:click={onSave}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
