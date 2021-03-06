const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

const playerHeight = '6rem';
const playerHeightSmall = '4rem';
const mobileEpInfoTabsHeight = '2.5rem';

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
			brightPurple: '#8755AF',
			dullBrightPurple: '#755C8A',
			deepPurple: '#372248',
			dullPurple: '#414770',
			darkPurple: '#1D152C',
		},
		fontFamily: {
			display: ['Cormorant SC', ...defaultTheme.fontFamily.serif],
			body: ['Nunito Sans', ...defaultTheme.fontFamily.sans],
		},
		extend: {
			brightness: {
				35: '.35',
			},
			fontSize: {
				hero: ['15vmax', '11vmax'],
				heroSmall: ['22vmin', '17vmin'],
				subHero: ['3.5vmax', '3.2vmax'],
				subHeroSmall: ['7vmin', '6.4vmin'],
				episodeNum: ['15vw'],
			},
			inset: {
				playerMobileMenu: playerHeightSmall,
			},
			letterSpacing: {
				display: '-0.035em',
			},
			textIndent: {
				hero: '-0.5em',
				footer: '-2em',
			},
			height: {
				player: playerHeight,
				playerSmall: playerHeightSmall,
				screenMinusPlayer: `calc(100vh - ${playerHeight})`,
				screenMinusPlayerAndTabs: `calc(100vh - ${playerHeightSmall} - ${mobileEpInfoTabsHeight})`,
				screenMinusPlayerSmall: `calc(100vh - ${playerHeightSmall})`,
				screenMinusPlayerAndTabsSmall: `calc(100vh - ${playerHeightSmall} - ${mobileEpInfoTabsHeight})`,
			},
			width: {
				playerTextMobile: 'calc(100vw - 22rem)',
				playerTextMobileSmall: 'calc(100vw - 8rem)',
			},
			flex: {
				playerTrack: '1 1 66rem',
			},
			gridTemplateColumns: {
				episodesEven: '1fr 5fr 25rem',
				episodesEvenMed: '1fr 5fr 15rem',
				episodesEvenSmall: '1fr 5fr',
				episodesOdd: '25rem 5fr 1fr',
				episodesOddMed: '15rem 5fr 1fr',
				episodesOddSmall: '5fr 1fr',
				episodesTiny: '1fr',
			},
			gridTemplateRows: {
				mobileEpInfoTabs: `${mobileEpInfoTabsHeight} 1fr`,
			},
			boxShadow: {
				navButton: '0 0 8px 10px rgba(10,10,10,0.4)',
				innerButton: 'inset 0 2px 12px 0 rgba(10,10,10,0.8)',
			},
			padding: {
				hero: '4vmax',
				heroSmall: '4vmin',
			},
			backgroundImage: (theme) => ({
				'georgian-pattern':
					"radial-gradient(70% 60% at 50% 50%, rgba(10, 10, 10, 0) 39%, #0A0A0A 100%), url('/images/georgian-pattern.svg')",
				player: 'linear-gradient(180deg, #0D78C1 -300px, #0a0a0a)',
			}),
		},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require('tailwind-scrollbar'),
		require('tailwindcss-textshadow'),
		require('tailwindcss-text-indent')(),
	],
};
