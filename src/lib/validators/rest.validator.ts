import { z } from 'zod';

export const requestSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1).max(100),
	url: z.string().url(),
	method: z.enum([
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
	])
});

export const editRequestSchema = requestSchema;

export type TRESTRequestSchema = typeof requestSchema;
export type TRESTRequestSchemaInfer = z.infer<TRESTRequestSchema>;
