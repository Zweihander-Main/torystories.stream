import React, { memo, useContext } from 'react';
import useEpisodeList from 'hooks/useEpisodeList';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Link } from 'gatsby';
import { RiPlayCircleLine } from 'react-icons/ri';
import TrackContext from 'contexts/TrackContext';
import PlayerStateContext from 'contexts/PlayerStateContext';

type EpisodeImageProps = {
	featuredImage: IGatsbyImageData | null;
	title: string;
	shouldDisplayIcon: boolean;
	handlePlayClick: (e: React.MouseEvent<SVGElement>, id: string) => void;
	id: string;
};

const EpisodeImage: React.FC<EpisodeImageProps> = ({
	featuredImage,
	title,
	shouldDisplayIcon,
	handlePlayClick,
	id,
}) => {
	if (featuredImage) {
		return (
			<div className="grid grid-rows-none grid-cols-none">
				{shouldDisplayIcon && (
					<RiPlayCircleLine
						size="100%"
						className="h-full self-center justify-self-center row-start-1 row-end-1 col-start-1 col-end-1 z-20 text-white opacity-20 hover:opacity-80 cursor-pointer"
						onClick={(e) => handlePlayClick(e, id)}
					/>
				)}
				<GatsbyImage
					image={featuredImage}
					alt={title}
					objectFit={'cover'}
					className="h-full self-center justify-self-center row-start-1 row-end-1 col-start-1 col-end-1 z-10"
				/>
			</div>
		);
	}
	return null;
};

const MemoizedCoverImage = memo(
	EpisodeImage,
	(prevProps, nextProps) =>
		prevProps.featuredImage === nextProps.featuredImage &&
		prevProps.title === nextProps.title &&
		prevProps.shouldDisplayIcon === nextProps.shouldDisplayIcon &&
		prevProps.id === nextProps.id
);

const EpisodeList: React.FC = () => {
	const { episodeArray } = useEpisodeList();
	const { trackId, setTrackId } = useContext(TrackContext);
	const { isPlayerPlaying, setIsPlayerPlaying } =
		useContext(PlayerStateContext);

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
								<MemoizedCoverImage
									featuredImage={featuredImage}
									title={title}
									shouldDisplayIcon={
										!isPlayerPlaying || id !== trackId
									}
									handlePlayClick={handlePlayClick}
									id={id}
								/>
							</div>
						</Link>
					</div>
				);
			})}
		</section>
	);
};

export default EpisodeList;
