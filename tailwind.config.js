const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	purge: ['public/**/*.html', 'src/**/*.{js,jsx,ts,tsx}'],
	mode: 'jit',
	darkMode: false, // or 'media' or 'class'
	theme: {
		colors: {
			black: '#0a0a0a',
			white: colors.white,
		},
		fontFamily: {
			display: ['Cormorant SC', ...defaultTheme.fontFamily.serif],
			body: ['Nunito Sans', ...defaultTheme.fontFamily.sans],
		},
		extend: {
			fontSize: {
				hero: ['15vw', '11vw'],
				subHero: ['3.5vw', '3.2vw'],
			},
			letterSpacing: {
				display: '-0.035em',
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
