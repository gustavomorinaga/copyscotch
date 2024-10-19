export type TUnicode = string;

/**
 * Mapping of special characters to their corresponding Unicode representations.
 */
export const UNICODES = { enter: '&ldca;' } as const satisfies Record<string, TUnicode>;
