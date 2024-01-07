import { superValidate } from 'sveltekit-superforms/server';
import { editRequestSchema as schema } from '$lib/validators';

export const load = async () => {
	return { form: await superValidate(schema) };
};

// TODO: implement editRequest and sendRequest

export const actions = {
	async editRequest() {},
	async sendRequest() {}
};
