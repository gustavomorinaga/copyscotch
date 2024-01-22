/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

type NestedProps<T> = {
	[K in keyof T]?: T[K] extends Array<infer U> ? NestedProps<U> : T[K];
};

/**
 * Finds a nested value in a collection.
 *
 * @template T - The type of the value to be found.
 * @template C - The type of the collection (either an array or an object).
 * @param collections - The collection to search in.
 * @param search - The search criteria.
 * @returns The found value, or undefined if not found.
 */
export function findNested<T = any, C = Array<any> | Record<string, any>>(
	collections: C,
	search: NestedProps<C>
): T | undefined {
	const [key] = Object.keys(search);

	const value = search[key as keyof typeof search];
	if (!value) return undefined;

	if (!Array.isArray(collections)) {
		const record = collections as Record<string, any>;
		const found = record[key] === value;
		return found ? collections : findNested<(typeof record)[string]>(record[key], value);
	}

	return collections.find((collection) => {
		if (Array.isArray(collection[key])) return findNested(collection[key], value);
		return collection[key] === value;
	});
}
