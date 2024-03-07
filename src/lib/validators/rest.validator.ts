import { z } from 'zod';
import { KeyValueSchema } from '$lib/validators';

export const MethodEnum = z.enum([
	'GET',
	'POST',
	'PUT',
	'PATCH',
	'DELETE',
	'HEAD',
	'OPTIONS',
	'CONNECT',
	'TRACE',
	'CUSTOM'
]);

export const BodyContentTypeEnum = z.enum([
	'application/json',
	// 'application/xml',
	// 'application/x-www-form-urlencoded',
	// 'multipart/form-data',
	'text/html',
	'text/plain'
]);

export const HeaderSchema = KeyValueSchema.extend({ override: z.boolean() });

export const RequestTabsEnum = z.enum(['params', 'body', 'headers', 'auth']);

export const BodySchema = z.object({
	body: z.string().max(10000).nullable(),
	contentType: BodyContentTypeEnum.nullable()
});

export const RESTRequestSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1).max(100),
	url: z.string().url(),
	method: MethodEnum,
	params: KeyValueSchema.array(),
	body: BodySchema,
	headers: HeaderSchema.array()
});

export const RESTTabSchema = z.object({
	id: z.string().uuid(),
	context: RESTRequestSchema,
	currentTab: RequestTabsEnum,
	dirty: z.boolean()
});

export type TRESTTabSchema = typeof RESTTabSchema;
export type TRESTTabInfer = z.infer<TRESTTabSchema>;
export type TRESTRequestSchema = typeof RESTRequestSchema;
export type TRESTRequestInfer = z.infer<TRESTRequestSchema>;
export type TRESTHeaderInfer = z.infer<typeof HeaderSchema>;

export const DEFAULT_REQUEST: Omit<TRESTTabInfer['context'], 'id'> = {
	name: 'Untitled',
	url: 'https://jsonplaceholder.typicode.com/todos/1',
	method: 'GET',
	params: [],
	body: { body: null, contentType: null },
	headers: []
};

export const DEFAULT_HEADER: TRESTHeaderInfer = {
	key: '',
	value: '',
	active: true,
	override: false
};
