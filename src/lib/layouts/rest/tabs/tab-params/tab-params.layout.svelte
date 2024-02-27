<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import { FeedbackParametersEmpty, ToolbarParams } from '$lib/layouts/rest';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { Trash } from 'lucide-svelte';
	import type { TKeyValueInfer, TRESTRequestInfer } from '$lib/validators';
	import type { SuperForm } from 'sveltekit-superforms';

	const DEFAULT_KEY_VALUE: TKeyValueInfer = {
		key: '',
		value: '',
		active: true
	};
</script>

<script lang="ts">
	type $$Props = { form: SuperForm<TRESTRequestInfer> };

	export let form: $$Props['form'];

	$: ({ form: formData } = form);
	$: hasParams = $formData.params.length > 0;

	function handleRemove(index: number) {
		$formData.params.splice(index, 1);
		$formData.params = $formData.params;
	}

	onMount(() => {
		if (!hasParams) $formData.params = [DEFAULT_KEY_VALUE];
	});
</script>

<ToolbarParams {form} />

{#if hasParams}
	<ul class="flex w-full flex-1 flex-col">
		{#each $formData.params as { key, value, active }, index}
			{@const order = index + 1}

			<li class="flex w-full flex-1">
				<Form.Join class="w-full flex-1 divide-x border-b">
					<Form.Field {form} name="params[{index}].key" class="flex w-full flex-1">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								placeholder="Parameter {order}"
								class="inline-flex w-full flex-1 rounded-none border-none !ring-transparent !ring-offset-transparent"
								bind:value={key}
							/>
						</Form.Control>
					</Form.Field>

					<Form.Field {form} name="params[{index}].value" class="flex w-full flex-1">
						<Form.Control let:attrs>
							<Input
								{...attrs}
								placeholder="Value {order}"
								class="inline-flex w-full flex-1 rounded-none border-none !ring-transparent !ring-offset-transparent"
								bind:value
							/>
						</Form.Control>
					</Form.Field>

					<Form.Field {form} name="params[{index}].active" class="flex items-center justify-center">
						<Form.Control let:attrs>
							<Checkbox
								{...attrs}
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
							aria-label="Remove Parameter"
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
	<FeedbackParametersEmpty />
{/if}
