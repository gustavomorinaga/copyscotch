<script lang="ts" context="module">
	import { getRESTTabContext } from '$lib/contexts';
	import { ToolbarBody } from '$lib/layouts/rest/toolbars/toolbar-body';
	import { FeedbackBodyEmpty } from '$lib/layouts/rest/feedbacks/feedback-body-empty';
	import { CodeMirror, type Langs } from '$lib/components/ui/codemirror';
	import { BodyContentTypeEnum, type TRESTRequestInfer, type TRESTTabInfer } from '$lib/validators';
	import type { SuperForm } from 'sveltekit-superforms';

	const { options: contentTypeOptions } = BodyContentTypeEnum;

	type TContentTypeOption = (typeof contentTypeOptions)[number];

	const CONTENT_TYPES_LANGS = {
		'application/json': 'json',
		'text/html': 'html',
		'text/plain': undefined
	} as const satisfies Record<TContentTypeOption, Langs>;
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
		tab = tabContext.get(tabID) as TRESTTabInfer;
	}
	$: if (tab) lang = CONTENT_TYPES_LANGS[tab.context.body.contentType || 'text/plain'];
</script>

<ToolbarBody {tabID} {form} />

{#if tab?.context.body.contentType !== null}
	<CodeMirror editable {lang} bind:value={$formData.body.body} />
{:else}
	<FeedbackBodyEmpty />
{/if}
