import React from 'react';
import useEpisodeList from 'hooks/useEpisodeList';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Link } from 'gatsby';

const Episode: React.FC = () => {};

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
					<div key={id} className="flex flex-column">
						<Link to={slug}>
							<div className="grid grid-cols-episodes grid-rows-episodes bg-brightBlue text-black hover:bg-dullBlue">
								<div className="font-display text-episodeNum kern-episode-num justify-self-center self-center">
									{episodeNum}
								</div>
								<div className="pl-4 pr-4 pt-8 pb-8 self-center">
									<h3 className="font-display text-5xl tracking-display pb-4">
										{title}
									</h3>
									<p className="font-body text-2xl">
										{blurb}
									</p>
								</div>
								<div>
									{featuredImage && (
										<GatsbyImage
											image={featuredImage}
											alt={title}
											objectFit={'cover'}
											className="h-full self-center justify-self-center"
										/>
									)}
								</div>
							</div>
						</Link>
					</div>
				);
			})}
		</section>
	);
};

export default EpisodeList;
