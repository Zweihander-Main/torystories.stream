const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const playerHeight = '6rem';

module.exports = {
	purge: ['public/**/*.html', 'src/**/*.{js,jsx,ts,tsx}'],
	mode: 'jit',
	darkMode: false, // or 'media' or 'class'
	theme: {
		colors: {
			black: '#0a0a0a',
			white: colors.white,
			brightBlue: '#0D78C1',
			dullBlue: '#5B85AA',
			dullPurple: '#414770',
			deepPurple: '#372248',
			darkPurple: '#171123',
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
			height: {
				player: playerHeight,
				screenMinusPlayer: `calc(100vh - ${playerHeight})`,
			},
			backgroundImage: (theme) => ({
				'georgian-pattern':
					"radial-gradient(70% 70% at 50% 50%, rgba(10, 10, 10, 0) 39%, #0A0A0A 100%), url('/images/georgian-pattern.svg')",
			}),
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
