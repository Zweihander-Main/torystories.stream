import React from 'react';
import { getSrc, StaticImage } from 'gatsby-plugin-image';

const Hero: React.FC = () => {
	// style={{
	// 	position: 'absolute',
	// }}
	// imgStyle={{
	// 	objectFit: 'contain',
	// 	objectPosition: 'center 40%',
	// }}

	return (
		<section>
			<StaticImage
				src="../../../images/herobg-house-of-commons-pitt.png"
				alt="Background: Karl Anton Hickel's William Pitt addressing the House of Commons"
				layout="fullWidth"
			/>
			<h1>
				Tory
				<br />
				Stories
			</h1>
		</section>
	);
};

export default Hero;
