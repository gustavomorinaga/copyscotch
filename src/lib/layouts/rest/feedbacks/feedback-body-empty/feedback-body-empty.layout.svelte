<script lang="ts" context="module">
	import { Center } from '$lib/components/ui/center';
	import { mode } from '$lib/components/mode-watcher';
</script>

<div class="flex flex-col p-2">
	<Center>
		<div class="mt-2 flex max-w-sm select-none flex-col items-center">
			<img
				src="/images/states/{$mode}/upload_single_file.svg"
				alt="Empty body"
				loading="lazy"
				class="inline-flex flex-col object-contain object-center"
				width="56"
				height="56"
			/>
			<span class="mt-2 max-w-sm whitespace-normal text-center text-tiny text-muted-foreground">
				This request does not have a body
			</span>
		</div>
	</Center>
</div>
