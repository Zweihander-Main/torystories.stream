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
		className="z-10 self-center h-full col-start-1 col-end-1 row-start-1 row-end-1 justify-self-center"
	/>
);

const MemoizedGatsbyEpisodeImage = memo(
	GatsbyEpisodeImage,
	(prevProps, nextProps) =>
		prevProps.title === nextProps.title &&
		prevProps.featuredImage?.images?.fallback?.src ===
			nextProps.featuredImage?.images?.fallback?.src
);

type EpisodeProps = {
	id: string;
	title: string;
	featuredImage: IGatsbyImageData | null;
	blurb: string;
	episodeNum: number;
	slug: string;
	isPlayerPlaying: boolean;
	handlePlayClick: (
		e: React.MouseEvent<HTMLButtonElement>,
		id: string
	) => void;
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
	const isEven = episodeNum % 2 === 0;
	return (
		<div className="flex flex-column">
			<Link className={'no-underline hover:font-normal'} to={slug}>
				<div
					className={`grid grid-rows-1 grid-cols-episodesTiny text-black ${
						isEven
							? 'sm:grid-cols-episodesEvenSmall lg:grid-cols-episodesEvenMed 2xl:grid-cols-episodesEven  bg-brightBlue hover:bg-dullBlue'
							: 'sm:grid-cols-episodesOddSmall lg:grid-cols-episodesOddMed 2xl:grid-cols-episodesOdd bg-brightPurple hover:bg-dullBrightPurple'
					}`}
				>
					<div
						className={`col-span-1 col-start-1 ${
							isEven
								? 'sm:col-start-1 lg:col-start-1 lg:col-end-2'
								: 'sm:col-start-2 lg:col-start-3 lg:col-end-4'
						} row-start-1 row-span-1 font-display text-episodeNum kern-episode-num justify-self-center self-center`}
					>
						{episodeNum}
					</div>
					<div
						className={`pt-0 sm:pt-12 pb-6 sm:pb-12 pl-6 pr-6 self-center col-span-1 col-start-1 row-start-2 sm:row-start-1 row-span-1 lg:col-start-2 ${
							isEven
								? 'sm:col-start-2 sm:pl-4 sm:pr-12'
								: 'sm:col-start-1 sm:pl-12 sm:pr-4'
						}`}
					>
						<h3 className="pb-4 text-4xl md:text-5xl font-display tracking-display text-shadow">
							{title}
						</h3>
						<p className="text-xl md:text-2xl font-body">{blurb}</p>
					</div>
					<div
						className={`col-start-1 col-span-2 lg:col-span-1 ${
							isEven
								? 'lg:col-start-3 lg:col-end-4'
								: 'lg:col-start-1 lg:col-end-2'
						} row-start-3 sm:row-start-2 lg:row-start-1 row-span-1 grid grid-rows-none grid-cols-none`}
					>
						{(!isPlayerPlaying || id !== trackId) && (
							<button
								className="z-20 self-center h-full col-start-1 col-end-1 row-start-1 row-end-1 text-white cursor-pointer justify-self-center opacity-20 hover:opacity-80"
								onClick={(e) => handlePlayClick(e, id)}
								aria-label={`Play Episode ${episodeNum}`}
							>
								<RiPlayCircleLine size="100%" />
							</button>
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

	const handlePlayClick = (
		e: React.MouseEvent<HTMLButtonElement>,
		id: string
	) => {
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
