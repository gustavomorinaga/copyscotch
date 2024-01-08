<script lang="ts">
	import { getRESTStore } from '$lib/stores';
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import { DialogEditRequest, TabRequest } from '$lib/layouts';
	import { Plus, X } from 'lucide-svelte';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { TRESTEditRequestSchema } from '$lib/validators';

	type $$Props = {
		form: SuperValidated<TRESTEditRequestSchema>;
	};

	export let form: $$Props['form'];

	const restStore = getRESTStore();
	$: ({ requests } = $restStore);
	$: hasOnlyOneRequest = $restStore.requests.length === 1;
</script>

<Tabs.Root value={$restStore.activeRequest}>
	<Tabs.List
		class="relative flex justify-start rounded-none h-fit p-0 overflow-x-auto scrollbar-thin scrollbar-thumb-secondary"
	>
		{#each requests as request}
			{@const requestID = request.id}
			{@const methodLowCase = request.method.toLowerCase()}

			<Tabs.Trigger
				class="relative justify-between gap-2 h-12 before:absolute before:top-0 before:inset-x-0 before:h-[.125rem] data-[state=active]:before:bg-primary before:bg-transparent"
				aria-label={request.name}
				value={request.id}
				on:click={() => restStore.setActiveRequest(request.id)}
			>
				<DialogEditRequest {requestID} {form}>
					<svelte:fragment slot="trigger">
						<div class="tab-trigger-content">
							<span class="method" style="color: var(--method-{methodLowCase}-color)">
								{request.method}
							</span>
							<span class="name">{request.name}</span>
						</div>
					</svelte:fragment>
				</DialogEditRequest>

				{#if !hasOnlyOneRequest}
					<div class="tab-trigger-suffix">
						<Button
							size="icon"
							variant="ghost"
							class="w-5 h-5"
							on:click={() => restStore.closeRequest(request.id)}
							disabled={hasOnlyOneRequest}
						>
							<X class="w-4 h-4" />
							<span class="sr-only">Close</span>
						</Button>
					</div>
				{/if}
			</Tabs.Trigger>
		{/each}

		<Button size="icon" variant="ghost" class="w-8 h-8 mx-3" on:click={restStore.addRequest}>
			<Plus class="w-4 h-4" />
			<span class="sr-only">Add</span>
		</Button>
	</Tabs.List>

	{#each requests as request}
		{@const requestID = request.id}

		<Tabs.Content value={requestID}>
			<TabRequest {requestID} {form} />
		</Tabs.Content>
	{/each}
</Tabs.Root>

<style lang="postcss">
	.tab-trigger-content {
		@apply inline-flex items-baseline justify-center gap-2;

		& > span.method {
			@apply block overscroll-none text-xs font-medium uppercase;
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
