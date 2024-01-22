import { z } from 'zod';
import { RESTRequestSchema } from '.';

export const RESTBaseFolderSchema = z.object({
	id: z.string().uuid(),
	name: z.string().min(1).max(100),
	requests: z.array(RESTRequestSchema)
});

export const RESTCollectionSchema: z.ZodType<TFolderInfer> = RESTBaseFolderSchema.extend({
	folders: z.lazy(() => RESTCollectionSchema.array())
});

export type TFolderInfer = z.infer<typeof RESTBaseFolderSchema> & { folders: Array<TFolderInfer> };
export type TFolderSchema = typeof RESTBaseFolderSchema;
export type TRESTCollectionSchema = typeof RESTCollectionSchema;
export type TRESTCollectionInfer = z.infer<TRESTCollectionSchema>;
