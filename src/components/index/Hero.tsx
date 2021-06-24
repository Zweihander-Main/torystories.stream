import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

const Hero: React.FC = () => {
	return (
		<section className="grid grid-rows-2 grid-cols-1 h-screenMinusPlayer">
			<StaticImage
				src="../../images/herobg-house-of-commons-pitt.png"
				alt="Background: Karl Anton Hickel's William Pitt addressing the House of Commons"
				layout="fullWidth"
				className="row-start-1 row-end-3 col-start-1 z-10"
			/>
			<h1 className="row-start-1 row-end-3 col-start-1 z-20 w-min pr-4 pb-12 justify-self-center self-center text-white font-display tracking-display text-hero hero-indent one-word-per-line text-shadow-xl">
				Tory Stories
			</h1>
			<h2 className="row-start-2 row-end-3 col-start-1 z-20 pb-1 pr-2 self-end text-white font-body text-subHero text-right one-word-per-line text-shadow-xl">
				The Martin Hutchinson Podcast
			</h2>
		</section>
	);
};

export default Hero;
