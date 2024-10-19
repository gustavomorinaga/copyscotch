import type { TMetadataConfig } from '$lib/components/metadata';

/**
 * Configuration object for the site metadata.
 */
export const siteConfig: TMetadataConfig = {
	name: 'Copyscotch',
	url: 'https://copyscotch.vercel.app',
	ogImage: 'https://copyscotch.vercel.app/images/banner.png',
	ogType: 'website',
	description: 'Helps you create requests faster, saving precious time on development.',
	author: 'gustavomorinaga',
	links: {
		twitter: 'https://twitter.com/gustavomorinaga',
		github: 'https://github.com/gustavomorinaga/copyscotch'
	},
	keywords: `API,HTTP,SPA,REST,Developer,Tools,shadcn,Svelte,SvelteKit,TailwindCSS,Melt UI,Bit UI`
};
