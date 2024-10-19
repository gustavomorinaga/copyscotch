import { sequence } from '@sveltejs/kit/hooks';
import { minifyHandle } from '$lib/server/hooks';

export const handle = sequence(minifyHandle);
