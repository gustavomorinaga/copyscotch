<script lang="ts" context="module">
	import { getRESTTabContext } from '$lib/contexts';
	// import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { type TRESTRequestInfer, type TRESTTabInfer } from '$lib/validators';
	import type { SuperForm } from 'sveltekit-superforms';
</script>

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id']; form: SuperForm<TRESTRequestInfer> };

	export let tabID: $$Props['tabID'];
	export let form: $$Props['form'];

	const tabContext = getRESTTabContext();

	// $: ({ form: formData } = form);
</script>

<div class="sticky top-[9.825rem] z-10 flex h-10 shrink-0 flex-col bg-background lg:top-[6.825rem]">
	<div
		class="flex w-full flex-1 items-center justify-between overflow-x-auto overflow-y-hidden pl-4"
	>
		<div class="flex">
			<span class="select-none truncate text-sm font-semibold text-muted-foreground">
				Content Type
			</span>
		</div>
	</div>

	<Separator orientation="horizontal" />
</div>
