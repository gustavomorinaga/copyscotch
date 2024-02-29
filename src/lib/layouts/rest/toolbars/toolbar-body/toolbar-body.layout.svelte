<script lang="ts" context="module">
	import { getRESTTabContext } from '$lib/contexts';
	// import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';
	import { BodyContentTypeEnum } from '$lib/validators';
	import type { TRESTRequestInfer, TRESTTabInfer } from '$lib/validators';
	import type { SuperForm } from 'sveltekit-superforms';
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id']; form: SuperForm<TRESTRequestInfer> };

	export let tabID: $$Props['tabID'];
	export let form: $$Props['form'];

	const tabContext = getRESTTabContext();

	const { options: contentTypes } = BodyContentTypeEnum;

	$: ({ form: formData } = form);
</script>

<div class="sticky top-[9.825rem] z-10 flex h-10 shrink-0 flex-col bg-background lg:top-[6.825rem]">
	<div
		class="flex w-full flex-1 items-center justify-between overflow-x-auto overflow-y-hidden pl-4"
	>
		<div class="flex items-center">
			<span class="mr-4 select-none truncate text-sm font-semibold text-muted-foreground">
				Content Type
			</span>

			<Form.Field {form} name="method" class="min-w-20">
				<Form.Control let:attrs>
					<Select.Root
						selected={{
							value: $formData.body?.contentType,
							label: $formData.body?.contentType || 'None'
						}}
						onSelectedChange={(v) => v && ($formData.body.contentType = v.value)}
					>
						<Select.Trigger
							{...attrs}
							class="relative border-none font-semibold !ring-transparent !ring-offset-transparent"
						>
							<Select.Value />
						</Select.Trigger>
						<Select.Content class="!min-w-64">
							<Select.Item value={null}>None</Select.Item>

							{#each contentTypes as contentType}
								<Select.Item value={contentType}>
									{contentType}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden name={attrs.name} bind:value={$formData.method} />
				</Form.Control>
			</Form.Field>
		</div>
	</div>

	<Separator orientation="horizontal" />
</div>
