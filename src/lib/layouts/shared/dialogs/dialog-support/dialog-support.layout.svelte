<script lang="ts" context="module">
	import { LINKS } from '$lib/maps';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import Github from 'lucide-svelte/icons/github';
	import type { ComponentType } from 'svelte';

	type TOption = (typeof LINKS)[keyof typeof LINKS] & {
		description: string;
		icon: ComponentType;
	};

	const OPTIONS = [
		{
			...LINKS.github,
			description: 'View the source code on GitHub',
			icon: Github
		}
	] satisfies Array<TOption>;
</script>

<Dialog.Root closeOnOutsideClick={false}>
	<Dialog.Trigger asChild let:builder>
		<slot {builder} />
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Support</Dialog.Title>
		</Dialog.Header>

		<div class="flex flex-col space-y-2">
			{#each OPTIONS as option}
				<Button
					variant="ghost"
					href={option.href}
					target={option.target ?? '_self'}
					rel={option.rel}
					aria-label={option.title}
					class="h-fit shrink-0"
				>
					<div class="mr-4 inline-flex items-center self-start">
						<svelte:component this={option.icon} class="mt-0.5 h-5 w-5 shrink-0 text-primary" />
					</div>
					<div class="inline-flex flex-1 select-none flex-col items-start truncate">
						<span class="max-w-[16rem] truncate font-semibold">{option.title}</span>
						<p class="text-left text-muted-foreground">{option.description}</p>
					</div>
					<ChevronRight class="h-5 w-5 shrink-0 text-muted-foreground" />
				</Button>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>
