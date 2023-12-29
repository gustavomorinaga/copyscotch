<script lang="ts">
	import { getRESTStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { DialogEditRequest, TabRequest } from '$lib/layouts';
	import { Plus, X } from 'lucide-svelte';

	const restStore = getRESTStore();
	$: ({ requests } = $restStore);
	$: hasOnlyOneRequest = $restStore.requests.length === 1;
</script>

<Tabs.Root>
	<Tabs.List class="w-full justify-start rounded-none">
		{#each requests as request}
			{@const requestID = request.id}
			{@const method = request.method.toLowerCase()}

			<Tabs.Trigger
				class="justify-between gap-2 overflow-hidden"
				aria-label={request.name}
				value={request.id}
			>
				<DialogEditRequest {requestID} openOnDblClick>
					<svelte:fragment slot="trigger">
						<div class="tab-trigger-content">
							<span class="method" style="color: var(--method-{method}-color)">
								{request.method}
							</span>
							<span class="name">{request.name}</span>
						</div>
					</svelte:fragment>
				</DialogEditRequest>

				<div class="tab-trigger-suffix">
					<Button
						size="icon"
						variant="ghost"
						class="w-5 h-5"
						on:click={() => restStore.closeRequest(request.id)}
						disabled={hasOnlyOneRequest}
					>
						<X class="w-4 h-4" />
						<div role="tooltip" hidden aria-hidden="true">Close</div>
					</Button>
				</div>
			</Tabs.Trigger>
		{/each}

		<Button
			size="icon"
			variant="ghost"
			class="w-5 h-5 ml-2"
			title="add"
			on:click={restStore.addRequest}
		>
			<Plus class="w-4 h-4" />
		</Button>
	</Tabs.List>

	{#each requests as request}
		<Tabs.Content value={request.id}>
			<TabRequest />
		</Tabs.Content>
	{/each}
</Tabs.Root>

<style lang="postcss">
	.tab-trigger-content {
		@apply inline-flex items-center justify-center gap-2;

		& > span.method {
			@apply block text-xs font-medium uppercase;
		}

		& > span.name {
			@apply block w-32 truncate text-left text-sm font-semibold;
		}
	}

	.tab-trigger-suffix {
		@apply inline-flex items-center justify-center gap-2;
		@apply opacity-60 transition-opacity hover:opacity-100;
	}
</style>
