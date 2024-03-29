export type TShortcut = { key: string; modifier: Array<'ctrl' | 'alt' | 'meta'> };

/**
 * Mapping of keyboard shortcuts to their corresponding key and modifier combinations.
 */
export const SHORTCUTS = {
	fullscreen: {
		key: 'f11',
		modifier: []
	},
	newTab: {
		key: 'n',
		modifier: ['ctrl', 'alt']
	},
	send: {
		key: 'enter',
		modifier: ['ctrl']
	},
	save: {
		key: 's',
		modifier: ['ctrl']
	}
} as const satisfies Record<string, TShortcut>;
