/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Debounces a callback function, ensuring that it is only called after a specified delay
 * since the last time it was invoked.
 *
 * @param callback The callback function to be debounced.
 * @param wait The delay in milliseconds before invoking the callback function. Default is 300ms.
 * @returns A debounced version of the callback function.
 */
export function debounce(callback: (...args: Array<any>) => void, wait = 300) {
	let timeout: ReturnType<typeof setTimeout>;

	return (...args: Array<any>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => callback(...args), wait);
	};
}
