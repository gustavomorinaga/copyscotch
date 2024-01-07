<script lang="ts" context="module">
	import { getRESTStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import type { TRESTRequest } from '$lib/ts';
</script>

<script lang="ts">
	type $$Props = { requestID: TRESTRequest['id'] };

	export let requestID: $$Props['requestID'];

	const restStore = getRESTStore();
	let index = $restStore.requests.findIndex(({ id }) => id === requestID);
	let request = $restStore.requests[index];
</script>

<form class="flex py-2 px-4 items-center space-x-2">
	<Input type="url" id="url" name="url" bind:value={request.url} />
	<Button type="submit">Send</Button>
</form>
