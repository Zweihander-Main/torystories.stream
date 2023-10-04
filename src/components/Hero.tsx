import * as React from 'react';
import { StaticImage } from 'gatsby-plugin-image';
import { graphql, useStaticQuery } from 'gatsby';

const Hero: React.FC = () => {
	const heroData = useStaticQuery<Queries.HeroQuery>(graphql`
		query Hero {
			site {
				siteMetadata {
					title
					subtitle
				}
			}
		}
	`);

	if (
		!(
			heroData &&
			heroData?.site &&
			heroData?.site?.siteMetadata &&
			heroData?.site.siteMetadata.title &&
			heroData?.site.siteMetadata.subtitle
		)
	) {
		throw new Error('Some part of Hero required site metadata is missing.');
	}

	const heroText = heroData?.site?.siteMetadata?.title;
	const subHeroText = heroData?.site?.siteMetadata?.subtitle;

	return (
		<section className="grid grid-cols-1 grid-rows-2 h-screenMinusPlayerSmall md:h-screenMinusPlayer">
			<StaticImage
				src="../images/herobg-house-of-commons-pitt.png"
				alt="Background: Karl Anton Hickel's William Pitt addressing the House of Commons"
				layout="fullWidth"
				className="z-10 col-start-1 row-start-1 row-end-3"
			/>
			<h1 className="z-20 self-center col-start-1 row-start-1 row-end-3 pr-4 text-white w-min pb-heroSmall sm:pb-hero justify-self-center font-display tracking-display text-heroSmall sm:text-hero indent-hero one-word-per-line text-shadow-xl">
				{heroText}
			</h1>
			<h2 className="z-20 self-end col-start-1 row-start-2 row-end-3 pb-1 pr-2 text-right text-white font-body text-subHeroSmall sm:text-subHero one-word-per-line text-shadow-xl">
				{subHeroText}
			</h2>
		</section>
	);
};

export default Hero;
