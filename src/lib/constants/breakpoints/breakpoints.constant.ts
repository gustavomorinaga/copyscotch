/**
 * Defines the breakpoints map.
 * The keys represent the breakpoint names, and the values represent the breakpoint sizes.
 */
export const BREAKPOINTS = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280
} as const satisfies Record<string, number>;

export type TBreakpoint = keyof typeof BREAKPOINTS;
