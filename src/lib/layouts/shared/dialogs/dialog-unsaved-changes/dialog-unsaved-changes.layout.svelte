<script lang="ts" context="module">
	import { getRESTStore, getRESTTabStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import type { TRESTTabInfer } from '$lib/validators';
</script>

<script lang="ts">
	const restStore = getRESTStore();
	const tabStore = getRESTTabStore();
	$: ({ tainted } = $tabStore);
	$: tab = (tainted ? tabStore.get(tainted) : {}) as TRESTTabInfer;

	let open = false;

	$: if (tainted && tainted === tab.id) open = true;

	function handleDiscard() {
		tabStore.setTainted(undefined);
		tabStore.close(tab.id);
		open = false;
	}

	function handleSave() {
		restStore.save(tab.context);
		tabStore.setTainted(undefined);
		tabStore.close(tab.id);
		open = false;
	}
</script>

<AlertDialog.Root {open} closeOnOutsideClick={false}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>You have unsaved changes</AlertDialog.Title>
			<AlertDialog.Description>
				Do you want to save changes made in this tab?
			</AlertDialog.Description>
		</AlertDialog.Header>

		<AlertDialog.Footer>
			<Button variant="ghost" on:click={handleDiscard}>No</Button>
			<Button variant="default" on:click={handleSave}>Yes</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
