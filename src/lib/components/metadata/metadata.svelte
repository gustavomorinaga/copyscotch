<script lang="ts">
	import type { TMetadata, TMetadataConfig } from '.';
	import { page } from '$app/stores';

	export let config: TMetadataConfig;

	$: metadata = $page.data?.metadata as TMetadata | undefined;
	$: title = metadata?.title ? `${config.name} - ${metadata.title}` : config.name;
	$: description = metadata?.description || config.description;
	$: ogImage = metadata?.ogImage || config.ogImage;
	$: ogType = metadata?.ogType || config.ogType;
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico" sizes="any" />
	<link rel="icon" href="/logo.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/images/icons/apple-touch-icon-180x180.png" />
	<link rel="manifest" href="/site.webmanifest" />
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={config.keywords} />
	<meta name="author" content={config.author} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={config.url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />
	<meta name="twitter:image:alt" content={config.name} />
	<meta name="twitter:creator" content={config.author} />
	<meta property="og:title" content={title} />
	<meta property="og:type" content={ogType} />
	<meta property="og:url" content={config.url + $page.url.pathname} />
	<meta property="og:image" content={ogImage} />
	<meta property="og:image:alt" content={config.name} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:description" content={description} />
	<meta property="og:site_name" content={config.name} />
	<meta property="og:locale" content="EN_US" />
</svelte:head>
