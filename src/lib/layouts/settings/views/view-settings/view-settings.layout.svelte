<script lang="ts" context="module">
	import { getSettingsStore } from '$lib/stores';
	import * as Form from '$lib/components/ui/form';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { ThemeSchema } from '$lib/validators';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { Cloud, Monitor, Moon, Sun } from 'lucide-svelte';

	const ICONS = { system: Monitor, light: Sun, dark: Cloud, black: Moon } as const;
</script>

<script lang="ts">
	const settingsStore = getSettingsStore();

	const backgroundOptions = ThemeSchema.shape.backgroundColor.options;
	const accentOptions = ThemeSchema.shape.accentColor.options;

	const settingsForm = superForm(defaults(zod(ThemeSchema)), {
		SPA: true,
		validators: zod(ThemeSchema),
		validationMethod: 'oninput',
		resetForm: false
	});

	$: ({ form: formValue } = settingsForm);
	$: if ($settingsStore) {
		$formValue.expandNavigation = $settingsStore.navigation === 'expand';
		$formValue.sidebarOnLeft = $settingsStore.sidebar === 'open';
	}

	function onChangeNavigation(checked: boolean) {
		$settingsStore.navigation = checked ? 'expand' : 'collapse';
	}

	function onChangeSidebar(checked: boolean) {
		$settingsStore.sidebar = checked ? 'open' : 'closed';
	}
</script>

<div class="container h-full">
	<section class="flex flex-1 flex-col">
		<Form.Root
			form={settingsForm}
			schema={ThemeSchema}
			controlled
			class="md:grid md:grid-cols-3 md:gap-4"
			let:config
		>
			<header class="select-none p-8 md:col-span-1">
				<h3 class="text-xl font-bold">Theme</h3>
				<p class="my-1 text-sm text-muted-foreground">Customize your application theme.</p>
			</header>

			<div class="space-y-8 p-8 md:col-span-2">
				<Form.Fieldset>
					<Form.Legend class="mb-4">Background</Form.Legend>

					<Form.Field {config} name="backgroundColor">
						<Form.Item>
							<ToggleGroup.Root type="single" class="justify-start">
								{#each backgroundOptions as option}
									<ToggleGroup.Item value={option}>
										<svelte:component this={ICONS[option]} class="h-4 w-4" />
										<span class="sr-only capitalize">{option}</span>
									</ToggleGroup.Item>
								{/each}
							</ToggleGroup.Root>
						</Form.Item>
					</Form.Field>
				</Form.Fieldset>

				<Form.Fieldset>
					<Form.Legend class="mb-4">Layout</Form.Legend>

					<Form.Join class="flex-col gap-4">
						<Form.Field {config} name="expandNavigation">
							<Form.Item class="flex items-center gap-2 space-y-0">
								<Form.Switch onCheckedChange={onChangeNavigation} />
								<Form.Label>Expand navigation</Form.Label>
							</Form.Item>
						</Form.Field>

						<Form.Field {config} name="sidebarOnLeft">
							<Form.Item class="flex items-center gap-2 space-y-0">
								<Form.Switch onCheckedChange={onChangeSidebar} />
								<Form.Label>Sidebar on left</Form.Label>
							</Form.Item>
						</Form.Field>
					</Form.Join>
				</Form.Fieldset>
			</div>
		</Form.Root>
	</section>
</div>
