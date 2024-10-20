/* eslint-disable ts/no-explicit-any */
export type TResponse = Pick<Response, 'ok' | 'status' | 'headers'> & {
	blob: Blob;
	raw: string;
	time: number;
	json?: any;
};
