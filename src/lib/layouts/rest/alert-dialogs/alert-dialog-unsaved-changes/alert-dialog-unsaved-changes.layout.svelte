<script lang="ts" context="module">
	import { getRESTContext, getRESTTabContext } from '$lib/contexts';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
</script>

<script lang="ts">
	const [restStore, tabStore] = [getRESTContext(), getRESTTabContext()];

	$: open = $tabStore.tainted?.length > 0;
	$: isCurrent =
		$tabStore.current &&
		$tabStore.tainted?.length === 1 &&
		$tabStore.tainted?.includes($tabStore.current);
	$: dirtyTabs = $tabStore.tabs.filter((tab) => tab.dirty && $tabStore.tainted?.includes(tab.id));

	function handleDiscard() {
		tabStore.close({ ids: $tabStore.tainted, mode: 'normal' });
		tabStore.setTainted(undefined);
	}

	function handleSave() {
		const requests = dirtyTabs.map((tab) => tab.context);
		// restStore.save(requests);
		tabStore.close({ ids: $tabStore.tainted, mode: 'normal' });
		tabStore.setTainted(undefined);
	}
</script>

<AlertDialog.Root {open} closeOnOutsideClick={false}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>You have unsaved changes</AlertDialog.Title>
			<AlertDialog.Description>
				{#if isCurrent}
					Do you want to save changes made in this tab?
				{:else}
					Are you sure you want to close all tabs? {dirtyTabs.length} unsaved tabs will be lost.
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>

		<AlertDialog.Footer>
			<AlertDialog.Cancel on:click={handleDiscard}>No</AlertDialog.Cancel>
			<AlertDialog.Action on:click={handleSave}>Yes</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
