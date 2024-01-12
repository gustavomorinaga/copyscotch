/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Executes an array of functions in parallel and returns a Promise that resolves when all functions have completed.
 * @param functions An array of functions to execute in parallel.
 * @returns A Promise that resolves to an array of PromiseSettledResult objects, each representing the outcome of the corresponding function.
 */
export const executeParallel = async <T extends (...args: Array<any>) => any>(
	functions: Array<T>
) => {
	return Promise.all(functions.map((fn) => new Promise<T>((resolve) => resolve(fn()))));
};
