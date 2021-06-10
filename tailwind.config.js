const colors = require('tailwindcss/colors');

module.exports = {
	purge: ['public/**/*.html', 'src/**/*.{js,jsx,ts,tsx}'],
	mode: 'jit',
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {
			colors: {
				teal: colors.amber,
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
