import { type Options, minify as minifier } from 'html-minifier';

/**
 * Options for HTML minification.
 */
const MINIFICATION_OPTIONS: Options = {
	collapseBooleanAttributes: true,
	collapseWhitespace: true,
	conservativeCollapse: true,
	decodeEntities: true,
	html5: true,
	ignoreCustomComments: [/^#/],
	minifyCSS: true,
	minifyJS: true,
	removeAttributeQuotes: true,
	removeComments: false, // some hydration code needs comments, so leave them in
	removeOptionalTags: true,
	removeRedundantAttributes: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true,
	sortAttributes: true,
	sortClassName: true
};

/**
 * Minifies the given HTML text using the specified options.
 * @param text The HTML text to be minified.
 * @returns The minified HTML text.
 */
export const minify = (text: string): string => minifier(text, MINIFICATION_OPTIONS);
