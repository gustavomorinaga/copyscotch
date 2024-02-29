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
	'application/xml',
	'application/x-www-form-urlencoded',
	'multipart/form-data',
	'text/html',
	'text/plain'
]);

export const RequestTabsEnum = z.enum(['params', 'body', 'headers', 'auth']);

export const BodySchema = z.object({
	body: z.string().min(1).max(10000),
	contentType: BodyContentTypeEnum
});

export const RESTRequestSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1).max(100),
	url: z.string().url(),
	method: MethodEnum.default('GET'),
	params: KeyValueSchema.array(),
	body: BodySchema.optional(),
	headers: KeyValueSchema.array()
});

export const RESTTabSchema = z.object({
	id: z.string().uuid(),
	context: RESTRequestSchema,
	currentTab: RequestTabsEnum.default('params'),
	dirty: z.boolean()
});

export type TRESTTabSchema = typeof RESTTabSchema;
export type TRESTTabInfer = z.infer<TRESTTabSchema>;
export type TRESTRequestSchema = typeof RESTRequestSchema;
export type TRESTRequestInfer = z.infer<TRESTRequestSchema>;
