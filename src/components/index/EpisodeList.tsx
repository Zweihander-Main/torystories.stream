import React, { useContext } from 'react';
import useEpisodeList from 'hooks/useEpisodeList';
import { GatsbyImage } from 'gatsby-plugin-image';
import { Link } from 'gatsby';
import PlayerContext from 'contexts/PlayerContext';
import { RiPlayCircleLine } from 'react-icons/ri';

const EpisodeList: React.FC = () => {
	const { episodeArray } = useEpisodeList();
	const { trackId, setTrackId, isPlayerPlaying, setIsPlayerPlaying } =
		useContext(PlayerContext);

	const handlePlayClick = (e: React.MouseEvent<SVGElement>, id: string) => {
		e.preventDefault();
		setTrackId(id);
		if (!isPlayerPlaying) {
			setIsPlayerPlaying(true);
		}
	};

	return (
		<section>
			{episodeArray.map((episode) => {
				const { id, title, featuredImage, blurb, episodeNum, slug } =
					episode;
				return (
					<div key={id} className="flex flex-column">
						<Link
							className={'no-underline hover:font-normal'}
							to={slug}
						>
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
								<div className="grid grid-rows-none grid-cols-none">
									{(!isPlayerPlaying || id !== trackId) && (
										<RiPlayCircleLine
											size="100%"
											className="h-full self-center justify-self-center row-start-1 row-end-1 col-start-1 col-end-1 z-20 text-white opacity-20 hover:opacity-80 cursor-pointer"
											onClick={(e) =>
												handlePlayClick(e, id)
											}
										/>
									)}
									{featuredImage && (
										<GatsbyImage
											image={featuredImage}
											alt={title}
											objectFit={'cover'}
											className="h-full self-center justify-self-center row-start-1 row-end-1 col-start-1 col-end-1 z-10"
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
