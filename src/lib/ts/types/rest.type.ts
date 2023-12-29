export type TRESTMethods =
	| 'GET'
	| 'POST'
	| 'PUT'
	| 'PATCH'
	| 'DELETE'
	| 'HEAD'
	| 'OPTIONS'
	| 'CONNECT'
	| 'TRACE'
	| 'CUSTOM';

export type TRESTRequest = {
	id: string;
	name: string;
	url: string;
	method: TRESTMethods;
};
