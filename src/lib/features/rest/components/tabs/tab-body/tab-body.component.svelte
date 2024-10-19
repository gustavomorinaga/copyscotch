<script lang="ts" context="module">
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

<script lang="ts">
	type $$Props = { tabID: TRESTTabInfer['id']; form: SuperForm<TRESTRequestInfer> };

	export let tabID: $$Props['tabID'];
	export let form: $$Props['form'];

	const tabContext = getRESTTabContext();

	let tab!: TRESTTabInfer;
	let lang!: Langs;

	$: ({ form: formData } = form);
	$: if ($tabContext.tabs) {
		tab = tabContext.getTab(tabID) as TRESTTabInfer;
	}
	$: if (tab) lang = CONTENT_TYPES_LANGS[tab.context.body.contentType || 'text/plain'];
</script>

<ToolbarBody {tabID} {form} />

{#if tab?.context.body.contentType !== null}
	{#await Promise.all(LAZY_COMPONENTS) then [{ CodeMirror }]}
		<CodeMirror {...CODEMIRROR_CONFIG} {lang} bind:value={$formData.body.body} />
	{/await}
{:else}
	<FeedbackBodyEmpty />
{/if}
