<script lang="ts" context="module">
	import { alertDialogRequestDeletionStore as dialogStore } from '.';
	import { getRESTContext } from '$lib/contexts';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
</script>

<script lang="ts">
	const restContext = getRESTContext();

	function handleRequestDeletion() {
		if (!$dialogStore.requestID) return;

		restContext.removeFile($dialogStore.requestID);
		dialogStore.set({ open: false, requestID: undefined });
	}
</script>

<AlertDialog.Root bind:open={$dialogStore.open}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Confirm</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to permanently delete this request?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>No</AlertDialog.Cancel>
			<AlertDialog.Action on:click={handleRequestDeletion}>Yes</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
