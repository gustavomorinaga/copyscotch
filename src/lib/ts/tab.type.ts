/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from 'svelte';

export type TTab = {
	value: string;
	label: string;
	icon?: ComponentType;
	content: Promise<any>;
	disabled?: boolean;
};
