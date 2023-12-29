import { superValidate } from 'sveltekit-superforms/server';
import { editRequestSchema as schema } from '$lib/validators';

export const load = async () => {
	return { form: await superValidate(schema) };
};
