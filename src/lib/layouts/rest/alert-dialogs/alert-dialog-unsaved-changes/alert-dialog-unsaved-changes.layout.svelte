<script lang="ts" context="module">
	import { getRESTContext, getRESTTabContext } from '$lib/contexts';
	import { dialogSaveAsStore as dialogStore } from '$lib/layouts/rest/dialogs/dialog-save-as';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
</script>

<script lang="ts">
	const [restContext, tabContext] = [getRESTContext(), getRESTTabContext()];

	$: open = $tabContext.tainted?.length > 0;
	$: dirtyTabs = $tabContext.tabs.filter(
		(tab) => tab.dirty && $tabContext.tainted?.includes(tab.id)
	);

	function handleDiscard() {
		if (dirtyTabs.length === 1) tabContext.closeTabs({ ids: $tabContext.tainted, mode: 'normal' });
		tabContext.setTaintedTabs(undefined);
	}

	function handleSave() {
		const requests = dirtyTabs.map((tab) => tab.context);

		if (requests.length === 1) {
			const [request] = requests;
			const found = restContext.getFile(request.id);

			if (found) {
				restContext.updateFile(request);
				tabContext.closeTabs({ ids: [request.id], mode: 'normal' });
			} else {
				dialogStore.set({
					open: true,
					request,
					onSave: () => tabContext.closeTabs({ ids: [request.id], mode: 'normal' })
				});
			}
		} else if (requests.length > 1) {
			for (const request of requests) restContext.updateFile(request);
			tabContext.closeTabs({ ids: $tabContext.tainted, mode: 'normal' });
		}

		tabContext.setTaintedTabs(undefined);
	}
</script>

<AlertDialog.Root {open} closeOnOutsideClick={false}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>You have unsaved changes</AlertDialog.Title>
			<AlertDialog.Description>
				{#if dirtyTabs.length === 1}
					Do you want to save changes made in this tab?
				{:else if dirtyTabs.length > 1}
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
