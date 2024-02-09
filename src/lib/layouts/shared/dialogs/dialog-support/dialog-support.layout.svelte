<script lang="ts" context="module">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { LINKS } from '$lib/maps';
	import { ChevronRight, Github } from 'lucide-svelte';
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
					class="h-fit shrink-0"
				>
					<div class="mr-4 inline-flex items-center self-start">
						<svelte:component this={option.icon} class="mt-0.5 h-5 w-5 text-primary" />
					</div>
					<div class="inline-flex flex-1 flex-col items-start truncate">
						<span class="max-w-[16rem] truncate font-semibold">{option.title}</span>
						<p class="text-left text-muted-foreground">{option.description}</p>
					</div>
					<ChevronRight class="h-5 w-5 text-muted-foreground" />
				</Button>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>
