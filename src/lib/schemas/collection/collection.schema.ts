import { z } from 'zod';
import { RESTRequestSchema } from '$lib/schemas/rest';

export const RESTBaseFolderSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1).max(100)
});

export type TRESTBaseFolderSchema = typeof RESTBaseFolderSchema;
export type TRESTBaseFolderInfer = z.infer<TRESTBaseFolderSchema>;

export const RESTFolderSchema = RESTBaseFolderSchema.extend({
	requests: z.array(RESTRequestSchema)
});

export type TFolderSchema = typeof RESTFolderSchema;
export type TFolderInfer = z.infer<TFolderSchema> & { folders: Array<TFolderInfer> };
export type TFileInfer = TFolderInfer['requests'][number];

export const RESTCollectionSchema: z.ZodType<TFolderInfer> = RESTFolderSchema.extend({
	folders: z.lazy(() => RESTCollectionSchema.array())
});

export type TRESTCollectionSchema = typeof RESTCollectionSchema;
export type TRESTCollectionInfer = z.infer<TRESTCollectionSchema>;

export const DEFAULT_FOLDER: Omit<TFolderInfer, 'id'> = {
	name: 'Untitled',
	folders: [],
	requests: []
};
export const DEFAULT_FILE: Omit<TFileInfer, 'id'> = {
	name: 'Untitled',
	url: 'https://jsonplaceholder.typicode.com/todos/1',
	method: 'GET',
	params: [],
	body: { body: null, contentType: null },
	headers: []
};
