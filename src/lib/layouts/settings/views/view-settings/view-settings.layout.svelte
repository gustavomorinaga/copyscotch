<script lang="ts" context="module">
	import { getSettingsContext } from '$lib/contexts';
	import {
		ThemeSchema,
		BackgroundColorEnum,
		AccentColorEnum,
		type TThemeInfer
	} from '$lib/validators';
	import * as Form from '$lib/components/ui/form';
	import * as RadioGroup from '$lib/components/ui/radio-group';
	import { Switch } from '$lib/components/ui/switch';
	import { systemPrefersMode } from '$lib/components/mode-watcher';
	import Cloud from 'lucide-svelte/icons/cloud';
	import Monitor from 'lucide-svelte/icons/monitor';
	import Moon from 'lucide-svelte/icons/moon';
	import Sun from 'lucide-svelte/icons/sun';
	import { defaults, superForm, type ChangeEvent } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';

	const THEME_ICONS = { system: Monitor, light: Sun, dark: Cloud, black: Moon } as const;
</script>

<script lang="ts">
	const settingsContext = getSettingsContext();

	const formID: string = 'view-settings';
	const { options: backgroundOptions } = BackgroundColorEnum;
	const { options: accentOptions } = AccentColorEnum;

	const form = superForm(defaults(zod(ThemeSchema)), {
		id: formID,
		SPA: true,
		validators: zod(ThemeSchema),
		validationMethod: 'oninput',
		resetForm: false,
		onChange: handleOnChange
	});

	const { enhance } = form;
	$: ({ form: formData } = form);

	$: if ($settingsContext) {
		form.reset({
			data: {
				backgroundColor: $settingsContext.backgroundColor,
				accentColor: $settingsContext.accentColor,
				expandNavigation: $settingsContext.navigation === 'expand',
				sidebarOnLeft: $settingsContext.sidebarPosition === 'left'
			}
		});
	}

	function handleOnChange(event: ChangeEvent<TThemeInfer>) {
		if (!event.paths.length) return;
		for (const path of event.paths) {
			if (path !== 'expandNavigation' && path !== 'sidebarOnLeft') {
				settingsContext.save({ [path]: $formData[path] });
				continue;
			}

			if (path === 'expandNavigation')
				settingsContext.save({ navigation: $formData.expandNavigation ? 'expand' : 'collapse' });
			if (path === 'sidebarOnLeft')
				settingsContext.save({ sidebarPosition: $formData.sidebarOnLeft ? 'left' : 'right' });
		}
	}
</script>

<div class="container h-full overflow-y-auto bg-background">
	<section class="flex flex-1 flex-col">
		<form id={formID} method="POST" class="md:grid md:grid-cols-3 md:gap-4" use:enhance>
			<header class="select-none py-8 sm:p-8 md:col-span-1">
				<h3 class="text-xl font-bold">Theme</h3>
				<p class="my-1 text-sm text-muted-foreground">Customize your application theme.</p>
			</header>

			<div class="space-y-8 sm:p-8 md:col-span-2">
				<Form.Fieldset {form} name="backgroundColor" let:value>
					<Form.Legend class="mb-0 select-none">Background</Form.Legend>
					<span class="mb-4 select-none text-sm capitalize text-muted-foreground">
						{value}

						{#if value === 'system'}
							({$systemPrefersMode || 'light'})
						{/if}
					</span>

					<RadioGroup.Root
						bind:value={$formData.backgroundColor}
						orientation="horizontal"
						class="flex flex-1"
					>
						{#each backgroundOptions as option}
							<Form.Control let:attrs>
								<Form.Label
									class="inline-flex shrink-0 cursor-pointer rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-accent-foreground [&:has([data-state=checked])]:bg-accent [&:has([data-state=checked])]:text-primary"
								>
									<RadioGroup.Item {...attrs} value={option} class="!sr-only" />
									<svelte:component this={THEME_ICONS[option]} class="h-5 w-5" />
									<span class="sr-only capitalize">{option}</span>
								</Form.Label>
							</Form.Control>
						{/each}
					</RadioGroup.Root>
				</Form.Fieldset>

				<Form.Fieldset {form} name="accentColor" let:value>
					<Form.Legend class="mb-0 select-none">Accent Color</Form.Legend>
					<span class="mb-4 select-none text-sm capitalize text-muted-foreground">{value}</span>

					<RadioGroup.Root
						bind:value={$formData.accentColor}
						orientation="horizontal"
						class="flex flex-1 flex-wrap"
					>
						{#each accentOptions as option}
							{@const color = `hsl(var(--${option}) / 1)`}

							<Form.Control let:attrs>
								<Form.Label
									for={attrs.id}
									class="inline-flex shrink-0 cursor-pointer rounded-md p-2 transition-colors hover:bg-muted [&:has([data-state=checked])]:bg-accent"
								>
									<RadioGroup.Item
										{...attrs}
										value={option}
										class="h-5 w-5 shrink-0"
										style="color: {color}; border-color: {color};"
									/>
									<span class="sr-only capitalize">{option}</span>
								</Form.Label>
							</Form.Control>
						{/each}
					</RadioGroup.Root>
				</Form.Fieldset>

				<fieldset>
					<legend class="mb-4 select-none text-sm font-medium">Layout</legend>

					<Form.Join class="flex-col gap-4">
						<Form.Field {form} name="expandNavigation" class="flex items-center gap-2 space-y-0">
							<Form.Control let:attrs>
								<Switch {...attrs} includeInput bind:checked={$formData.expandNavigation} />
								<Form.Label>Expand navigation</Form.Label>
							</Form.Control>
						</Form.Field>

						<Form.Field {form} name="sidebarOnLeft" class="flex items-center gap-2 space-y-0">
							<Form.Control let:attrs>
								<Switch {...attrs} includeInput bind:checked={$formData.sidebarOnLeft} />
								<Form.Label>Sidebar on left</Form.Label>
							</Form.Control>
						</Form.Field>
					</Form.Join>
				</fieldset>
			</div>
		</form>
	</section>
</div>
