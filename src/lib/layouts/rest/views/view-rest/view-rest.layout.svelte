<script lang="ts">
	import { getRESTStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { ContextMenuEditRequest, DialogEditRequest, TabRequest } from '$lib/layouts';
	import { Plus, X } from 'lucide-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { TRESTRequestSchema, TRESTRequestSchemaInfer } from '$lib/validators';

	type $$Props = { form: SuperValidated<TRESTRequestSchema> };

	export let form: $$Props['form'];

	const restStore = getRESTStore();

	$: ({ requests } = $restStore);
	$: hasOnlyOneRequest = requests.length === 1;

	function handleActiveTab(id: TRESTRequestSchemaInfer['id']) {
		restStore.setActiveRequest(id);
	}

	function handleCloseTab(
		event: MouseEvent | KeyboardEvent,
		requestID: TRESTRequestSchemaInfer['id']
	) {
		event.preventDefault();
		restStore.closeRequest(requestID);
	}
</script>

<Tabs.Root value={$restStore.activeRequest}>
	<Tabs.List
		class="relative flex justify-start rounded-none h-fit p-0 overflow-x-auto scrollbar-thin scrollbar-thumb-secondary"
	>
		{#each requests as request}
			{@const requestID = request.id}
			{@const methodLowCase = request.method.toLowerCase()}

			<ContextMenuEditRequest {requestID}>
				<Tabs.Trigger
					class="relative justify-between gap-2 min-w-52 h-12 before:absolute before:top-0 before:inset-x-0 before:h-[.125rem] data-[state=active]:before:bg-primary before:bg-transparent"
					aria-label={request.name}
					value={request.id}
					on:click={() => handleActiveTab(request.id)}
				>
					<DialogEditRequest {requestID} {form}>
						<div class="tab-trigger-content">
							<span class="method" style="color: var(--method-{methodLowCase}-color)">
								{request.method}
							</span>
							<span class="name">{request.name}</span>
						</div>
					</DialogEditRequest>

					{#if !hasOnlyOneRequest}
						<div class="tab-trigger-suffix">
							<Button
								size="icon"
								variant="ghost"
								class="w-5 h-5"
								role="button"
								tabindex={0}
								aria-label="Close Tab"
								disabled={hasOnlyOneRequest}
								on:click={(event) => handleCloseTab(event, requestID)}
								on:keydown={(event) => handleCloseTab(event, requestID)}
							>
								<X class="w-4 h-4" />
								<span role="presentation" class="sr-only">Close Tab</span>
							</Button>
						</div>
					{/if}
				</Tabs.Trigger>
			</ContextMenuEditRequest>
		{/each}

		<Button
			size="icon"
			variant="ghost"
			class="w-8 h-8 mx-3"
			role="button"
			tabindex={0}
			aria-label="Add Request"
			on:click={restStore.addRequest}
		>
			<Plus class="w-4 h-4" />
			<span role="presentation" class="sr-only">Add Request</span>
		</Button>
	</Tabs.List>

	{#each requests as request}
		{@const requestID = request.id}

		<Tabs.Content value={requestID} class="m-0 p-4">
			<TabRequest {requestID} {form} />
		</Tabs.Content>
	{/each}
</Tabs.Root>

<style lang="postcss">
	.tab-trigger-content {
		@apply inline-flex items-baseline justify-center gap-2;

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
