/**
 * Regular expressions map.
 */
export const REGEXES = {
	deep: /(\w+)(?:\[(\d+)\])?\.(.+)/
} as const satisfies Record<string, RegExp>;
