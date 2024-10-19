import { writable } from 'svelte/store';

export type TImportDialogStore = {
	open: boolean;
};

export const dialogImportStore = writable<TImportDialogStore>({
	open: false
});
