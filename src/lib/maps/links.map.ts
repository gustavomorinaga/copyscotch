import type { HTMLAnchorAttributes } from 'svelte/elements';

export type TLink = HTMLAnchorAttributes;

/**
 * Represents a collection of links.
 */
export const LINKS = {
	github: {
		title: 'GitHub',
		href: 'https://github.com/gustavomorinaga/copyscotch',
		target: '_blank',
		rel: 'noopener noreferrer'
	}
} satisfies Record<string, TLink>;
