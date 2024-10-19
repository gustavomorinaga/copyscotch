import { z } from 'zod';

export const FileUploadSchema = z.object({
	file: z
		.instanceof(File, { message: 'Please upload a file' })
		.refine((f) => f.size < 2_000_000, 'File size must be less than 2MB')
});

export type TFileUploadSchema = typeof FileUploadSchema;
export type TFileUploadInfer = z.infer<TFileUploadSchema>;
