import { superValidate } from 'sveltekit-superforms/client';
import { mainRequestSchema, editRequestSchema } from '$lib/validators';

export const load = async () => {
	return {
		forms: {
			editForm: await superValidate(editRequestSchema),
			mainForm: await superValidate(mainRequestSchema)
		}
	};
};
