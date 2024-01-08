import { superValidate } from 'sveltekit-superforms/client';
import { editRequestSchema } from '$lib/validators';

export const load = async () => {
	return { form: await superValidate(editRequestSchema) };
};
