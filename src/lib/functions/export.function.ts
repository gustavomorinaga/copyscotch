/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Exports data as a file with the specified filename and type.
 * @param data - The data to be exported.
 * @param filename - The name of the file to be downloaded.
 * @param type - The MIME type of the file.
 */
export function exportFile(data: any, filename: string, type: string) {
	const blob = new Blob([data], { type });
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	const event = new MouseEvent('click');
	a.dispatchEvent(event);
	window.URL.revokeObjectURL(url);
}
