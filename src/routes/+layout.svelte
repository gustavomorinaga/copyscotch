<script lang="ts">
	import '$lib/styles/app.pcss';
	import { Toolbar, Wrapper } from '$lib/layouts';
	import { Separator } from '$lib/components/ui/separator';
</script>

<Wrapper>
	<Toolbar />
	<Separator orientation="horizontal" role="presentation" />
	<slot />
</Wrapper>
