<script lang="ts">
	import { getRESTStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { DialogEditRequest, TabRequest } from '$lib/layouts';
	import { Plus, X } from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';

	export let form: ComponentProps<DialogEditRequest>['form'];

	const restStore = getRESTStore();
	$: ({ requests } = $restStore);
	$: hasOnlyOneRequest = $restStore.requests.length === 1;
	$: currentRequestID = $restStore.requests.at(0)?.id;
</script>

<Tabs.Root value={currentRequestID}>
	<Tabs.List class="flex justify-start rounded-none p-0 h-12">
		{#each requests as request}
			{@const requestID = request.id}
			{@const method = request.method.toLowerCase()}

			<Tabs.Trigger
				class="relative justify-between gap-2 overflow-hidden h-full before:absolute before:top-0 before:inset-x-0 before:h-[.125rem] data-[state=active]:before:bg-primary before:bg-transparent"
				aria-label={request.name}
				value={request.id}
			>
				<DialogEditRequest {requestID} {form}>
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
		{@const requestID = request.id}

		<Tabs.Content value={requestID}>
			<TabRequest {requestID} />
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
