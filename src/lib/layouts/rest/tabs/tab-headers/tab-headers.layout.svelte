<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { getRESTTabContext } from '$lib/contexts';
	import { FeedbackHeadersEmpty, ToolbarHeaders } from '$lib/layouts/rest';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { DEFAULT_KEY_VALUE, type TRESTRequestInfer, type TRESTTabInfer } from '$lib/validators';
	import { Trash } from 'lucide-svelte';
	import type { SuperForm } from 'sveltekit-superforms';
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
		$formData.headers = $formData.headers;
	}

	onMount(() => {
		if (!hasHeaders) tabContext.update(tabID, { headers: [DEFAULT_KEY_VALUE] });
	});
</script>

<ToolbarHeaders {tabID} {form} />

{#if hasHeaders}
	<ul class="flex w-full flex-1 flex-col">
		{#each $formData.headers as { key, value, active }, index}
			{@const order = index + 1}

			<li class="flex w-full flex-1">
				<Form.Join class="w-full flex-1 divide-x border-b">
					<Form.Field {form} name="headers[{index}].key" class="flex w-full flex-1">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								placeholder="Header {order}"
								class="inline-flex w-full flex-1 rounded-none border-none !ring-transparent !ring-offset-transparent"
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
								bind:value
							/>
						</Form.Control>
					</Form.Field>

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
							<span class="sr-only">{active ? 'Turn Off' : 'Turn On'}</span>
							<input name={attrs.name} value={active} hidden />
						</Form.Control>
					</Form.Field>

					<div class="flex items-center justify-center">
						<Button
							size="icon"
							variant="text"
							aria-label="Remove Header"
							class="rounded-none !text-destructive"
							on:click={() => handleRemove(index)}
						>
							<Trash class="h-5 w-5" />
							<span class="sr-only">Remove</span>
						</Button>
					</div>
				</Form.Join>
			</li>
		{/each}
	</ul>
{:else}
	<FeedbackHeadersEmpty {form} />
{/if}
