/**
 * Generates a random ID of the specified length.
 * @param length The length of the ID. Default is 8.
 * @returns The generated random ID.
 */
export const randomID = (length = 8) =>
	Math.random()
		.toString(36)
		.substring(2, length + 2);
