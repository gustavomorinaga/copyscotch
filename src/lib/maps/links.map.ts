import type { HTMLAnchorAttributes } from 'svelte/elements';

export type TLink = HTMLAnchorAttributes;

/**
 * Represents a collection of links.
 */
export const LINKS = {
	doc: {
		title: 'Documentation',
		href: 'https://github.com/gustavomorinaga/copyscotch',
		target: '_blank',
		rel: 'noopener noreferrer'
	}
} as const satisfies Record<string, TLink>;
