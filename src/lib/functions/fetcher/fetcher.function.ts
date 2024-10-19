import type { RESPONSE_TYPES } from '$lib/constants/responses';
import type { TResponse } from '$lib/ts';

type TResponseType = (typeof RESPONSE_TYPES)[number];

/**
 * Fetches a resource from the network and returns detailed information about the response.
 *
 * @param url - The resource URL or a `Request` object.
 * @param init - An optional object containing any custom settings that you want to apply to the request.
 * @returns A promise that resolves to an object containing the response details:
 * - `blob`: The response body as a `Blob`.
 * - `headers`: The response headers.
 * - `json`: The response body parsed as JSON (if applicable).
 * - `ok`: A boolean indicating whether the response was successful (status in the range 200-299).
 * - `raw`: The raw response body as text.
 * - `status`: The HTTP status code of the response.
 * - `time`: The time taken to fetch the resource, in milliseconds.
 */
export async function fetcher(url: RequestInfo | URL, init?: RequestInit) {
	const start = performance.now();

	const response = await fetch(url, init);

	const end = performance.now();
	const time = end - start;

	const blob = await response.clone().blob();

	const isJSON = (blob.type as TResponseType) === 'application/json';
	const promises = [response.clone().text()];
	if (isJSON) promises.push(response.clone().json());

	const [raw, json] = await Promise.all(promises);

	const result = {
		blob,
		headers: response.headers,
		json,
		ok: response.ok,
		raw,
		status: response.status,
		time
	} satisfies TResponse;

	return result;
}
