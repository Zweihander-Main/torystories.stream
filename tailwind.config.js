const colors = require('tailwindcss/colors');

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
			display: ['Cormorant SC'], //TODO add fallbacks
			body: ['Nunito Sans'],
		},
		extend: {
			fontSize: {
				hero: ['15vw', '10vw'],
				subHero: ['4vw', '4vw'],
			},
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
