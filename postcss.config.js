/** @type {import('postcss-load-config').Config} */
export default {
	plugins: {
		'postcss-import': {},
		'tailwindcss/nesting': {},
		tailwindcss: {},
		autoprefixer: {},
		...(import.meta.env?.MODE === 'production' && { cssnano: { preset: 'advanced' } })
	}
};
