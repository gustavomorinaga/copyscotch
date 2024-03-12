/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Retrieves nested fields from an array of objects.
 * @param array - The array of objects to retrieve fields from.
 * @param childArray - The key of the child array within each object.
 * @param field - The key of the field to retrieve from each object.
 * @returns An array of unique values retrieved from the specified field.
 */
export function retrieveNestedFields<T = any>(
	array: Array<T>,
	childArray: keyof T,
	field: keyof T
) {
	const fields: Array<typeof field> = [];

	function retrieve(item: T) {
		fields.push(item[field] as typeof field);

		const isArray = Array.isArray(item[childArray]);
		if (isArray && (item[childArray] as Array<any>).length) {
			(item[childArray] as Array<any>).forEach(retrieve);
		}
	}

	array.forEach(retrieve);

	return [...new Set(fields)];
}
