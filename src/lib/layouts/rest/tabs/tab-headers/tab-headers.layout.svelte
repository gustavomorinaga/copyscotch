<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import ArrowUpRight from 'lucide-svelte/icons/arrow-up-right';
	import Lock from 'lucide-svelte/icons/lock';
	import Trash from 'lucide-svelte/icons/trash';
	import type { SuperForm } from 'sveltekit-superforms';
	import { getRESTTabContext } from '$lib/contexts/rest';
	import { ToolbarHeaders } from '$lib/layouts/rest/toolbars/toolbar-headers';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { DEFAULT_HEADER, type TRESTRequestInfer, type TRESTTabInfer } from '$lib/schemas/rest';

	const LAZY_COMPONENTS = [import('$lib/layouts/rest/feedbacks/feedback-headers-empty')] as const;
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id']; form: SuperForm<TRESTRequestInfer> };

	export let tabID: $$Props['tabID'];
	export let form: $$Props['form'];

	const tabContext = getRESTTabContext();

	$: ({ form: formData } = form);
	$: hasHeaders = $formData.headers.length > 0;

	function handleRemove(index: number) {
		$formData.headers.splice(index, 1);
	}

	function handleRedirect() {
		tabContext.setCurrentInnerTab(tabID, 'body');
	}

	onMount(() => {
		if (!hasHeaders) tabContext.updateTab(tabID, { headers: [DEFAULT_HEADER] });
	});
</script>

<ToolbarHeaders {tabID} {form} />

{#if hasHeaders}
	<ul class="flex w-full flex-1 flex-col">
		{#each $formData.headers as { key, value, active, override }, index}
			{@const order = index + 1}

			<li class="flex w-full flex-1">
				<Form.Join class="w-full flex-1 divide-x border-b">
					<div class="flex h-10 w-10 items-center justify-center">
						{#if override}
							<Lock class="h-5 w-5 shrink-0 opacity-50" />
						{/if}
					</div>

					<Form.Field {form} name="headers[{index}].key" class="flex w-full flex-1">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								placeholder="Header {order}"
								class="inline-flex w-full flex-1 rounded-none border-none !ring-transparent !ring-offset-transparent"
								disabled={override}
								bind:value={key}
							/>
						</Form.Control>
					</Form.Field>

					<Form.Field {form} name="headers[{index}].value" class="flex w-full flex-1">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								placeholder="Value {order}"
								class="inline-flex w-full flex-1 rounded-none border-none !ring-transparent !ring-offset-transparent"
								disabled={override}
								bind:value
							/>
						</Form.Control>
					</Form.Field>

					{#if !override}
						<Form.Field
							{form}
							name="headers[{index}].active"
							class="flex items-center justify-center"
						>
							<Form.Control let:attrs>
								<Checkbox
									{...attrs}
									aria-label={active ? 'Turn Off' : 'Turn On'}
									class="flex h-full w-10 items-center justify-center !border-none !bg-transparent !text-success"
									bind:checked={active}
								/>
								<span class="sr-only select-none">{active ? 'Turn Off' : 'Turn On'}</span>
								<input name={attrs.name} value={active} hidden />
							</Form.Control>
						</Form.Field>
					{/if}

					<div class="flex items-center justify-center">
						<Button
							size="icon"
							variant="text"
							aria-label="Remove Header"
							class="rounded-none !text-destructive disabled:invisible"
							disabled={override}
							on:click={() => handleRemove(index)}
						>
							<Trash class="h-5 w-5 shrink-0" />
							<span class="sr-only select-none">Remove</span>
						</Button>
					</div>

					{#if override}
						<div class="flex items-center justify-center">
							<Button
								size="icon"
								variant="text"
								aria-label="Go to Body Tab"
								on:click={handleRedirect}
							>
								<ArrowUpRight class="h-5 w-5 shrink-0" />
								<span class="sr-only select-none">Go to Body Tab</span>
							</Button>
						</div>
					{/if}
				</Form.Join>
			</li>
		{/each}
	</ul>
{:else}
	{#await Promise.all(LAZY_COMPONENTS) then [{ FeedbackHeadersEmpty }]}
		<FeedbackHeadersEmpty {form} />
	{/await}
{/if}
