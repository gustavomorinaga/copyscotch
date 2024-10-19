<script lang="ts" context="module">
	import { alertDialogCollectionDeletionStore as dialogStore } from '.';
	import { getRESTContext } from '$lib/contexts/rest';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
</script>

<script lang="ts">
	const restContext = getRESTContext();

	function handleCollectionDeletion() {
		if (!$dialogStore.collectionID) return;

		restContext.removeFolder($dialogStore.collectionID);
		dialogStore.set({ open: false, collectionID: undefined });
	}
</script>

<AlertDialog.Root bind:open={$dialogStore.open}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Confirm</AlertDialog.Title>
			<AlertDialog.Description>
				Are you sure you want to permanently delete this collection?
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>No</AlertDialog.Cancel>
			<AlertDialog.Action on:click={handleCollectionDeletion}>Yes</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
