<script lang="ts" context="module">
	import { getSettingsStore } from '$lib/stores';
	import * as Form from '$lib/components/ui/form';
	import {
		ThemeSchema,
		BackgroundColorEnum,
		AccentColorEnum,
		type TThemeInfer
	} from '$lib/validators';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { Cloud, Monitor, Moon, Sun } from 'lucide-svelte';
	import { systemPrefersMode } from '$lib/components/mode-watcher';

	const THEME_ICONS = { system: Monitor, light: Sun, dark: Cloud, black: Moon } as const;
</script>

<script lang="ts">
	const settingsStore = getSettingsStore();

	const { options: backgroundOptions } = BackgroundColorEnum;
	const { options: accentOptions } = AccentColorEnum;

	const settingsForm = superForm(defaults(zod(ThemeSchema)), {
		SPA: true,
		validators: zod(ThemeSchema),
		validationMethod: 'oninput',
		resetForm: false
	});

	$: ({ form: formValue } = settingsForm);
	$: if ($settingsStore) {
		$formValue.backgroundColor = $settingsStore.backgroundColor;
		$formValue.accentColor = $settingsStore.accentColor;
		$formValue.expandNavigation = $settingsStore.navigation === 'expand';
		$formValue.sidebarOnLeft = $settingsStore.sidebar === 'open';
	}

	function handleBackgroundColor(value: string) {
		settingsStore.save({ backgroundColor: value as TThemeInfer['backgroundColor'] });
	}

	function handleAccentColor(value: string) {
		settingsStore.save({ accentColor: value as TThemeInfer['accentColor'] });
	}

	function handleNavigation(checked: boolean) {
		$settingsStore.navigation = checked ? 'expand' : 'collapse';
	}

	function handleSidebar(checked: boolean) {
		$settingsStore.sidebar = checked ? 'open' : 'closed';
	}
</script>

<div class="container h-full overflow-y-auto bg-background">
	<section class="flex flex-1 flex-col">
		<Form.Root
			form={settingsForm}
			schema={ThemeSchema}
			controlled
			class="md:grid md:grid-cols-3 md:gap-4"
			let:config
		>
			<header class="select-none py-8 sm:p-8 md:col-span-1">
				<h3 class="text-xl font-bold">Theme</h3>
				<p class="my-1 text-sm text-muted-foreground">Customize your application theme.</p>
			</header>

			<div class="space-y-8 sm:p-8 md:col-span-2">
				<Form.Fieldset>
					<Form.Field {config} name="backgroundColor" let:value>
						<Form.Legend class="mb-0 select-none">Background</Form.Legend>
						<span class="mb-4 select-none text-sm capitalize text-muted-foreground">
							{value}

							{#if value === 'system'}
								({$systemPrefersMode || 'light'})
							{/if}
						</span>

						<Form.RadioGroup
							orientation="horizontal"
							class="flex flex-1"
							onValueChange={handleBackgroundColor}
						>
							{#each backgroundOptions as option}
								<Form.Label
									for={option}
									class="inline-flex shrink-0 cursor-pointer rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground [&:has([data-state=checked])]:bg-accent [&:has([data-state=checked])]:text-primary"
								>
									<Form.RadioItem id={option} value={option} class="!sr-only" />
									<svelte:component this={THEME_ICONS[option]} class="h-5 w-5" />
									<span class="sr-only capitalize">{option}</span>
								</Form.Label>
							{/each}
						</Form.RadioGroup>
					</Form.Field>
				</Form.Fieldset>

				<Form.Fieldset>
					<Form.Field {config} name="accentColor" let:value>
						<Form.Legend class="mb-0 select-none">Accent Color</Form.Legend>
						<span class="mb-4 select-none text-sm capitalize text-muted-foreground">{value}</span>

						<Form.RadioGroup
							orientation="horizontal"
							class="flex flex-1 flex-wrap"
							onValueChange={handleAccentColor}
						>
							{#each accentOptions as option}
								{@const color = `hsl(var(--${option}) / 1)`}

								<Form.Label
									for={option}
									class="inline-flex shrink-0 cursor-pointer rounded-md p-2 transition-colors hover:bg-muted [&:has([data-state=checked])]:bg-accent"
								>
									<Form.RadioItem
										id={option}
										value={option}
										class="h-5 w-5 shrink-0"
										style="color: {color}; border-color: {color};"
									/>
									<span class="sr-only capitalize">{option}</span>
								</Form.Label>
							{/each}
						</Form.RadioGroup>
					</Form.Field>
				</Form.Fieldset>

				<Form.Fieldset>
					<Form.Legend class="mb-4 select-none">Layout</Form.Legend>

					<Form.Join class="flex-col gap-4">
						<Form.Field {config} name="expandNavigation">
							<Form.Item class="flex items-center gap-2 space-y-0">
								<Form.Switch onCheckedChange={handleNavigation} />
								<Form.Label>Expand navigation</Form.Label>
							</Form.Item>
						</Form.Field>

						<Form.Field {config} name="sidebarOnLeft">
							<Form.Item class="flex items-center gap-2 space-y-0">
								<Form.Switch onCheckedChange={handleSidebar} />
								<Form.Label>Sidebar on left</Form.Label>
							</Form.Item>
						</Form.Field>
					</Form.Join>
				</Form.Fieldset>
			</div>
		</Form.Root>
	</section>
</div>
