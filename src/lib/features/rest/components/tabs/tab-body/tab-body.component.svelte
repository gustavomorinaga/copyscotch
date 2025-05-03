<script lang="ts" module>
	import type { SuperForm } from 'sveltekit-superforms';
	import { getRESTTabContext } from '$lib/contexts/rest';
	import { ToolbarBody } from '$lib/features/rest/components/toolbars/toolbar-body';
	import { FeedbackBodyEmpty } from '$lib/features/rest/components/feedbacks/feedback-body-empty';
	import {
		BodyContentTypeEnum,
		type TRESTRequestInfer,
		type TRESTTabInfer
	} from '$lib/schemas/rest';
	import type { Langs, Props as TCodeMirror } from '$lib/components/ui/codemirror';

	type TContentTypeOption = (typeof BodyContentTypeEnum.options)[number];

	const CODEMIRROR_CONFIG: TCodeMirror = { editable: true, useTab: true, tabSize: 2 } as const;
	const CONTENT_TYPES_LANGS = {
		'application/json': 'json',
		'text/html': 'html',
		'text/plain': undefined
	} as const satisfies Record<TContentTypeOption, Langs>;
	const LAZY_COMPONENTS = [import('$lib/components/ui/codemirror')] as const;
</script>

<!-- svelte-ignore reactive_declaration_non_reactive_property -->
<script lang="ts">
	import { run } from 'svelte/legacy';

	

	interface Props {
		tabID: TRESTTabInfer['id'];
		form: SuperForm<TRESTRequestInfer>;
	}

	let { tabID, form }: Props = $props();

	const tabContext = getRESTTabContext();

	let tab!: TRESTTabInfer = $state();
	let lang!: Langs = $state();

	let { form: formData } = $derived(form);
	run(() => {
		if ($tabContext.tabs) tab = tabContext.getTab(tabID) as TRESTTabInfer;
	});
	run(() => {
		if (tab) lang = CONTENT_TYPES_LANGS[tab.context.body.contentType || 'text/plain'];
	});
</script>

<ToolbarBody {tabID} {form} />

{#if tab?.context.body.contentType !== null}
	{#await Promise.all(LAZY_COMPONENTS) then [{ CodeMirror }]}
		<CodeMirror {...CODEMIRROR_CONFIG} {lang} bind:value={$formData.body.body} />
	{/await}
{:else}
	<FeedbackBodyEmpty />
{/if}
