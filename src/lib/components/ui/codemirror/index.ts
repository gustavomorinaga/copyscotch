import Root from './codemirror.svelte';
import { html } from '@codemirror/lang-html';
import { json } from '@codemirror/lang-json';
import type { ThemeSpec } from 'svelte-codemirror-editor';

export const langs = { html, json } as const;

export const theme: ThemeSpec = {
	'&': {
		fontSize: 'calc(var(--base-font-size) - 2px)',
		height: '100%',
		width: '100%',
		flex: '1'
	},
	'.cm-content': {
		caretColor: 'hsl(var(--secondary-foreground) / 1)',
		fontFamily: 'var(--font-mono)',
		color: 'hsl(var(--secondary-foreground) / 1)',
		height: '100%'
	},
	'.cm-cursor': {
		borderColor: 'hsl(var(--secondary-foreground) / 1)'
	},
	'.cm-widgetBuffer': {
		position: 'absolute'
	},
	'.cm-selectionBackground': {
		backgroundColor: 'hsl(var(--primary) / 1) !important',
		color: 'hsl(var(--primary-foreground) / 1)',
		borderRadius: '0px'
	},
	'.cm-panels': {
		backgroundColor: 'hsl(var(--primary) / 1)',
		color: 'hsl(var(--secondary-foreground) / 1)',
		zIndex: '1'
	},
	'.cm-panels.cm-panels-top': {
		borderBottom: '1px solid hsl(var(--border) / 1)'
	},
	'.cm-panels.cm-panels-bottom': {
		borderTop: '1px solid hsl(var(--border) / 1)'
	},
	'.cm-search': {
		display: 'flex',
		alignItems: 'center',
		flexWrap: 'nowrap',
		flexShrink: '0',
		overflow: 'auto',
		padding: '0.25rem 0.5rem !important'
	},
	'.cm-search label': {
		display: 'inline-flex',
		alignItems: 'center'
	},
	'.cm-textfield': {
		backgroundColor: 'hsl(var(--primary) / 1)',
		color: 'hsl(var(--secondary-foreground) / 1)',
		borderColor: 'hsl(var(--border) / 1)',
		borderRadius: '4px',
		fontSize: 'calc(var(--base-font-size) - 4px)',
		fontWeight: '600',
		flexShrink: '0',
		border: '1px solid hsl(var(--border) / 1)'
	},
	'.cm-button': {
		backgroundColor: 'hsl(var(--primary) / 1)',
		color: 'hsl(var(--secondary) / 1)',
		backgroundImage: 'none',
		borderRadius: '4px',
		fontSize: 'calc(var(--base-font-size) - 4px)',
		fontWeight: '600',
		textTransform: 'capitalize',
		flexShrink: '0',
		border: '1px solid hsl(var(--border) / 1)'
	},
	'.cm-completionLabel': {
		color: 'var(--secondary-color)'
	},
	'.cm-tooltip': {
		backgroundColor: 'hsl(var(--primary) / 1)',
		color: 'hsl(var(--secondary) / 1)',
		border: 'none',
		borderRadius: '4px'
	},
	'.cm-tooltip-arrow': {
		color: 'var(--tooltip-color)'
	},
	'.cm-tooltip-arrow:after': {
		borderTopColor: 'currentColor !important'
	},
	'.cm-tooltip-arrow:before': {
		borderTopColor: 'currentColor !important'
	},
	'.cm-tooltip.cm-tooltip-autocomplete > ul': {
		fontFamily: 'var(--font-mono)'
	},
	'.cm-tooltip-autocomplete ul li[aria-selected]': {
		backgroundColor: 'hsl(var(--accent) / 1)',
		color: 'hsl(var(--accent-foreground) / 1)'
	},
	'.cm-tooltip-autocomplete ul li[aria-selected] .cm-completionLabel': {
		color: 'hsl(var(--accent-foreground) / 1)'
	},
	'.cm-activeLine': { backgroundColor: 'transparent' },
	'.cm-searchMatch': {
		outline: '1px solid hsl(var(--accent) / 1)',
		backgroundColor: 'hsl(var(--border) / 1)',
		borderRadius: '2px'
	},
	'.cm-selectionMatch': {
		outline: '1px solid var(--accent)',
		backgroundColor: 'hsl(var(--border) / 1)',
		borderRadius: '2px'
	},
	'.cm-matchingBracket, .cm-nonmatchingBracket': {
		backgroundColor: 'hsl(var(--border) / 1)',
		outline: '1px solid hsl(var(--accent) / 1)',
		borderRadius: '2px'
	},
	'.cm-gutters': {
		fontFamily: 'var(--font-mono)',
		backgroundColor: 'hsl(var(--background) / 1)',
		borderColor: 'hsl(var(--border) / 1)'
	},
	'.cm-lineNumbers': {
		minWidth: '3em',
		color: 'hsl(var(--muted-foreground) / 1)'
	},
	'.cm-foldGutter': {
		minWidth: '2em',
		color: 'hsl(var(--secondary-foreground) / 1)'
	},
	'.cm-foldGutter .cm-gutterElement': {
		textAlign: 'center'
	},
	'.cm-line': {
		paddingLeft: '0.5rem',
		paddingRight: '0.5rem'
	},
	'.cm-activeLineGutter': {
		backgroundColor: 'transparent'
	},
	'.cm-scroller::-webkit-scrollbar': {
		display: 'none'
	},
	'.cm-foldPlaceholder': {
		backgroundColor: 'hsl(var(--border) / 1)',
		color: 'hsl(var(--secondary-foreground) / 1)',
		borderColor: 'hsl(var(--border) / 1)'
	}
};

export { Root, Root as CodeMirror };
