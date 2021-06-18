import React from 'react';
import useEpisodeList from 'hooks/useEpisodeList';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Link } from 'gatsby';

const EpisodeList: React.FC = () => {
	const { episodeArray } = useEpisodeList();

	return (
		<section>
			{episodeArray.map((episode) => {
				const {
					id,
					title,
					featuredImage,
					audioURL,
					blurb,
					date,
					episodeNum,
					slug,
				} = episode;
				return (
					<div key={id}>
						<Link to={slug}>{title}</Link>
						{title}
						{featuredImage && (
							<GatsbyImage image={featuredImage} alt={title} />
						)}
					</div>
				);
			})}
		</section>
	);
};

export default EpisodeList;
