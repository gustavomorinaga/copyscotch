<script lang="ts" context="module">
	import { onMount } from 'svelte';
	import RefreshCw from 'lucide-svelte/icons/refresh-cw';
	import type { SuperForm } from 'sveltekit-superforms';
	import { getRESTTabContext } from '$lib/contexts';
	import {
		BodyContentTypeEnum,
		type TRESTHeaderInfer,
		type TRESTRequestInfer,
		type TRESTTabInfer
	} from '$lib/validators';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';

	const { options: contentTypes } = BodyContentTypeEnum;
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id']; form: SuperForm<TRESTRequestInfer> };

	export let tabID: $$Props['tabID'];
	export let form: $$Props['form'];

	const tabContext = getRESTTabContext();

	let toolbarRef!: HTMLElement;

	$: ({ form: formData } = form);
	$: contentTypeHeaderIndex = $formData.headers.findIndex(
		({ key }) => key.toLowerCase() === 'content-type'
	);

	function handleContentTypeChange(event?: Select.Selected<(typeof contentTypes)[number] | null>) {
		if (!event) return;

		if (contentTypeHeaderIndex !== -1 && $formData.headers[contentTypeHeaderIndex].override) {
			$formData.headers[contentTypeHeaderIndex].value = event.value || '';
			tabContext.updateTab(tabID, {
				headers: $formData.headers,
				body: { ...$formData.body, contentType: event.value }
			});
		} else {
			tabContext.updateTab(tabID, { body: { ...$formData.body, contentType: event.value } });
		}
	}

	function handleOverrideContentType() {
		const updatedHeader: TRESTHeaderInfer = {
			key: 'Content-Type',
			value: $formData.body.contentType || '',
			active: true,
			override: true
		};

		const headerIndex = $formData.headers.findIndex(
			({ key }) => key.toLowerCase() === 'content-type'
		);

		if (headerIndex === -1) {
			tabContext.updateTab(tabID, { headers: [...$formData.headers, updatedHeader] });
		} else {
			tabContext.updateTab(tabID, {
				headers: $formData.headers.map((header, index) =>
					index === headerIndex ? updatedHeader : header
				)
			});
		}

		tabContext.setCurrentInnerTab(tabID, 'headers');
	}

	onMount(() => {
		toolbarRef = document.getElementById('main-request-toolbar') as HTMLElement;
	});
</script>

<div
	class="sticky z-10 flex h-10 shrink-0 flex-col bg-background lg:top-[6.825rem] {toolbarRef?.offsetHeight >
	100
		? 'top-[9.825rem]'
		: 'top-[6.825rem]'}"
>
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
						onSelectedChange={handleContentTypeChange}
					>
						<Select.Trigger
							{...attrs}
							class="relative border-none font-semibold !ring-transparent !ring-offset-transparent"
						>
							<Select.Value />
						</Select.Trigger>
						<Select.Content class="!min-w-64">
							{#each [null, ...contentTypes] as contentType}
								<Select.Item value={contentType}>
									{contentType || 'None'}
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden name={attrs.name} bind:value={$formData.method} />
				</Form.Control>
			</Form.Field>

			<Tooltip.Root>
				<Tooltip.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						size="sm"
						variant="secondary"
						aria-label="Override Content Type"
						class="h-6"
						on:click={handleOverrideContentType}
					>
						<RefreshCw class="mr-2 h-4 w-4 shrink-0" />
						<span class="select-none capitalize">Override</span>
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content side="top" class="select-none">
					<span>
						Set <code class="bg-accent px-1">Content-Type</code>
						in Headers
					</span>
				</Tooltip.Content>
			</Tooltip.Root>
		</div>
	</div>

	<Separator orientation="horizontal" />
</div>
