import React from 'react';
import useEpisodeList from 'hooks/useEpisodeList';
import { GatsbyImage } from 'gatsby-plugin-image';

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
				} = episode;
				// NEXT: get this to work, it's not finding the imageURL
				return (
					<div key={id}>
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
