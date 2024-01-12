import { superValidate } from 'sveltekit-superforms/client';
import { RESTRequestSchema } from '$lib/validators';

export const load = async () => {
	return { form: await superValidate(RESTRequestSchema) };
};
