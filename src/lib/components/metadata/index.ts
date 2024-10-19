export { default as Metadata } from './metadata.svelte';

export type TMetadata = Partial<TMetadataConfig> & {
	title: string;
};

export type TMetadataConfig = {
	name: string;
	description: string;
	url: string;
	author: string;
	keywords: string;
	ogImage: string;
	ogType: string;
	links: Record<string, string>;
};
