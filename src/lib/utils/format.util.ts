/**
 * Formats the given number of bytes into a human-readable string representation.
 * @param bytes The number of bytes to format.
 * @param decimals The number of decimal places to include in the formatted string. Default is 2.
 * @returns A string representation of the formatted bytes.
 */
export function formatBytes(bytes: number, decimals: number): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const dm = decimals || 2;
	const sizes: string[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
