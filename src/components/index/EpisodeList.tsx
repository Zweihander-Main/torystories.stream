import React, { memo, useContext } from 'react';
import useEpisodeList from 'hooks/useEpisodeList';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { Link } from 'gatsby';
import { RiPlayCircleLine } from 'react-icons/ri';
import TrackContext from 'contexts/TrackContext';
import PlayerStateContext from 'contexts/PlayerStateContext';

type GatsbyEpisodeImageProps = {
	featuredImage: IGatsbyImageData;
	title: string;
};

const GatsbyEpisodeImage: React.FC<GatsbyEpisodeImageProps> = ({
	featuredImage,
	title,
}) => (
	<GatsbyImage
		image={featuredImage}
		alt={title}
		objectFit={'cover'}
		className="h-full self-center justify-self-center row-start-1 row-end-1 col-start-1 col-end-1 z-10"
	/>
);

const MemoizedGatsbyEpisodeImage = memo(GatsbyEpisodeImage);

type EpisodeProps = {
	id: string;
	title: string;
	featuredImage: IGatsbyImageData | null;
	blurb: string;
	episodeNum: number;
	slug: string;
	isPlayerPlaying: boolean;
	handlePlayClick: (e: React.MouseEvent<SVGElement>, id: string) => void;
	trackId: string;
};

const Episode: React.FC<EpisodeProps> = ({
	id,
	title,
	featuredImage,
	blurb,
	episodeNum,
	slug,
	isPlayerPlaying,
	handlePlayClick,
	trackId,
}) => {
	return (
		<div className="flex flex-column">
			<Link className={'no-underline hover:font-normal'} to={slug}>
				<div className="grid grid-cols-episodes grid-rows-episodes bg-brightBlue text-black hover:bg-dullBlue">
					<div className="font-display text-episodeNum kern-episode-num justify-self-center self-center">
						{episodeNum}
					</div>
					<div className="pl-4 pr-8 pt-8 pb-8 self-center">
						<h3 className="font-display text-5xl tracking-display pb-4">
							{title}
						</h3>
						<p className="font-body text-2xl">{blurb}</p>
					</div>
					<div className="grid grid-rows-none grid-cols-none">
						{(!isPlayerPlaying || id !== trackId) && (
							<RiPlayCircleLine
								size="100%"
								className="h-full self-center justify-self-center row-start-1 row-end-1 col-start-1 col-end-1 z-20 text-white opacity-20 hover:opacity-80 cursor-pointer"
								onClick={(e) => handlePlayClick(e, id)}
							/>
						)}
						{featuredImage && (
							<MemoizedGatsbyEpisodeImage
								{...{ featuredImage, title }}
							/>
						)}
					</div>
				</div>
			</Link>
		</div>
	);
};

const MemoizedEpisode = memo(
	Episode,
	(prevProps, nextProps) =>
		prevProps.id === nextProps.id &&
		prevProps.title === nextProps.title &&
		prevProps.featuredImage === nextProps.featuredImage &&
		prevProps.blurb === nextProps.blurb &&
		prevProps.episodeNum === nextProps.episodeNum &&
		prevProps.slug === nextProps.slug &&
		prevProps.isPlayerPlaying === nextProps.isPlayerPlaying &&
		prevProps.trackId === nextProps.trackId
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
					<MemoizedEpisode
						key={id}
						{...{
							id,
							title,
							featuredImage,
							blurb,
							episodeNum,
							slug,
							isPlayerPlaying,
							handlePlayClick,
							trackId,
						}}
					/>
				);
			})}
		</section>
	);
};

export default EpisodeList;
