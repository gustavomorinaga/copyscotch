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

export const mainRequestSchema = requestSchema.omit({ id: true });
export const editRequestSchema = requestSchema.pick({ name: true });

export type TRESTRequestSchema = typeof requestSchema;
export type TRESTRequestSchemaType = z.infer<TRESTRequestSchema>;
export type TRESTMainRequestSchema = typeof mainRequestSchema;
export type TRESTMainRequestSchemaType = z.infer<TRESTMainRequestSchema>;
export type TRESTEditRequestSchema = typeof editRequestSchema;
export type TRESTEditRequestSchemaType = z.infer<TRESTEditRequestSchema>;
