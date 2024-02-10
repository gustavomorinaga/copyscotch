import { z } from 'zod';

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

export const RESTRequestSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1).max(100),
	url: z.string().url(),
	method: MethodEnum.default('GET')
});

export const RESTTabSchema = z.object({
	id: z.string().uuid(),
	context: RESTRequestSchema,
	dirty: z.boolean()
});

export type TRESTTabSchema = typeof RESTTabSchema;
export type TRESTTabInfer = z.infer<TRESTTabSchema>;
export type TRESTRequestSchema = typeof RESTRequestSchema;
export type TRESTRequestInfer = z.infer<TRESTRequestSchema>;
