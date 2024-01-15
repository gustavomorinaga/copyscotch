<script lang="ts" context="module">
	import { getRESTStore, getRESTTabStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
</script>

<script lang="ts">
	const restStore = getRESTStore();
	const tabStore = getRESTTabStore();

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
		restStore.save(requests);
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
			<Button variant="ghost" on:click={handleDiscard}>No</Button>
			<Button variant="default" on:click={handleSave}>Yes</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
