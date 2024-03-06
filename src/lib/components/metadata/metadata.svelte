<script lang="ts">
	import { page } from '$app/stores';
	import { siteConfig } from '$lib/configs';

	export let title: string = siteConfig.name;

	$: title = $page.data?.title ? `${siteConfig.name} - ${$page.data.title}` : siteConfig.name;
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={siteConfig.description} />
	<meta name="keywords" content={siteConfig.keywords} />
	<meta name="author" content={siteConfig.author} />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={siteConfig.url} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={siteConfig.description} />
	<meta name="twitter:image" content={siteConfig.ogImage} />
	<meta name="twitter:image:alt" content={siteConfig.name} />
	<meta name="twitter:creator" content={siteConfig.author} />
	<meta property="og:title" content={title} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={siteConfig.url + $page.url.pathname} />
	<meta property="og:image" content={siteConfig.ogImage} />
	<meta property="og:image:alt" content={siteConfig.name} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:description" content={siteConfig.description} />
	<meta property="og:site_name" content={siteConfig.name} />
	<meta property="og:locale" content="EN_US" />
	<link rel="icon" href="/favicon.ico" sizes="any" />
	<link rel="icon" href="/logo.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/images/icons/apple-touch-icon-180x180.png" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>
