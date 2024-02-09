<script lang="ts" context="module">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { ChevronRight, Github } from 'lucide-svelte';
	import type { ComponentType } from 'svelte';

	type TOption = {
		title: string;
		description: string;
		icon: ComponentType;
		link: Pick<HTMLAnchorElement, 'href' | 'target'>;
	};

	const OPTIONS: Array<TOption> = [
		{
			title: 'GitHub',
			description: 'View the source code on GitHub',
			icon: Github,
			link: {
				href: 'https://github.com/gustavomorinaga/copyscotch',
				target: '_blank'
			}
		}
	];
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
					href={option.link.href}
					target={option.link.target ?? '_self'}
					rel={option.link.target === '_blank' ? 'noopener noreferrer' : undefined}
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
