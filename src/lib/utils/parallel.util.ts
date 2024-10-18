/* eslint-disable ts/no-explicit-any */

/**
 * Executes an array of functions in parallel and returns an array of their results.
 *
 * @param functions - An array of functions to execute in parallel.
 * @returns A promise that resolves to an array of the results of the executed functions.
 */
export function executeParallel<T extends (...args: any) => any>(functions: Array<T>) {
	return Promise.all(functions.map((fn) => new Promise<ReturnType<T>>((resolve) => resolve(fn()))));
}
