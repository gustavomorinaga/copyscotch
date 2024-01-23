/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Finds a nested object or array within a given record based on a partial term.
 *
 * @param record - The record to search within.
 * @param term - The partial term to match against the record.
 * @returns The nested object or array that matches the term, or undefined if no match is found.
 */
export function findNested<T extends object | any[], R = T>(
	record: R,
	term: Partial<R extends Array<any> ? R[number] : R>
): (T extends Array<any> ? T[number] : T) | undefined {
	const found = Object.entries(term).every(([k, v]) => (record as any)[k] === v);
	if (found) return record as T extends Array<any> ? T[number] : T;

	for (const [_, value] of Object.entries(record as any)) {
		if (typeof value === 'object') {
			const found = findNested(value, term);
			if (found) return found as T extends Array<any> ? T[number] : T;
		}
	}

	return undefined;
}

/**
 * Updates a nested object or array by matching a term and applying an update.
 *
 * @template T - The type of the record being updated.
 * @template R - The resulting type after the update.
 * @param record - The record to be updated.
 * @param term - The partial term used to match the record.
 * @param update - The partial update to be applied.
 * @returns The updated record.
 */
export function updateNested<T extends object | any[], R = T>(
	record: R,
	term: Partial<R extends Array<any> ? R[number] : R>,
	update: Partial<R extends Array<any> ? R[number] : R>
): R {
	const found = Object.entries(term).every(([k, v]) => (record as any)[k] === v);
	if (found) return { ...record, ...update } as R;

	for (const [k, value] of Object.entries(record as any)) {
		if (typeof value === 'object') {
			const found = updateNested(value, term, update);
			if (found) return { ...record, [k]: found } as R;
		}
	}

	return record as R;
}
