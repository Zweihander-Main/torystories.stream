import React from 'react';
import { StaticImage } from 'gatsby-plugin-image';

const Hero: React.FC = () => {
	// style={{
	// 	position: 'absolute',
	// }}
	// imgStyle={{
	// 	objectFit: 'contain',
	// 	objectPosition: 'center 40%',
	// }}

	return (
		<section className="grid grid-rows-2 grid-cols-1 h-screen">
			<StaticImage
				src="../../../images/herobg-house-of-commons-pitt.png"
				alt="Background: Karl Anton Hickel's William Pitt addressing the House of Commons"
				layout="fullWidth"
				className="row-start-1 row-end-3 col-start-1 z-10"
			/>
			<h1 className="row-start-1 row-end-2 col-start-1 z-20 text-white font-display text-hero hero-indent one-word-per-line">
				Tory Stories
			</h1>
			<h2 className="row-start-2 row-end-3 col-start-1 z-20 text-white self-end font-body text-subHero text-right one-word-per-line">
				The Martin Hutchinson Podcast
			</h2>
		</section>
	);
};

export default Hero;
