import { writable } from 'svelte/store';

export type ScreenStore = Pick<Window, 'innerWidth' | 'innerHeight'>;

export const screenStore = writable<ScreenStore>({
	innerWidth: 0,
	innerHeight: 0
});
