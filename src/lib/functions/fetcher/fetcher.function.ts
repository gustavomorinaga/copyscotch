import type { RESPONSE_TYPES } from '$lib/maps';
import type { TResponse } from '$lib/ts';

type TResponseType = (typeof RESPONSE_TYPES)[number];

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
