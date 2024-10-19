import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { minify } from '$lib/server/utils/minify';

/**
 * Minify Handle function that transforms the page chunk HTML and returns the minified page.
 *
 * @param input - The input object.
 * @param input.event - The incoming request event.
 * @param input.resolve - The function to resolve the request.
 * @returns The minified page.
 */
export const minifyHandle: Handle = async ({ event, resolve }) => {
	const { MODE } = import.meta.env;
	if (MODE !== 'production') return resolve(event);

	let page = '';

	return resolve(event, {
		transformPageChunk({ html, done }) {
			page += html;
			if (done) return building ? minify(page) : page;
		}
	});
};
