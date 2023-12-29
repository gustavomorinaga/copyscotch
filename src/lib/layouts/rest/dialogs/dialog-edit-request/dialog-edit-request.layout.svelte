<script lang="ts" context="module">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog';
	import type { TRESTRequest } from '$lib/ts';
</script>

<script lang="ts">
	type $$Props = Dialog.Props & {
		request: TRESTRequest;
		trigger?: Dialog.TriggerProps;
		openOnDblClick?: boolean;
	};

	export let request: $$Props['request'];
	export let open: $$Props['open'] = false;
	export let trigger: $$Props['trigger'] = undefined;
	export let openOnDblClick: $$Props['openOnDblClick'] = false;

	if (openOnDblClick) trigger = { ...trigger, asChild: true };

	function onDblClick() {
		if (openOnDblClick) open = true;
	}

	function onCancel() {
		open = false;
	}

	function onSave() {
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
			<Input type="text" id="name" value={request.name} />
		</div>

		<Dialog.Footer>
			<Button variant="ghost" on:click={onCancel}>Cancel</Button>
			<Button variant="default" on:click={onSave}>Save</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
