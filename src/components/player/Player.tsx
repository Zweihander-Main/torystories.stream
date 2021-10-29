import React, { memo, useContext } from 'react';
import ReactPlayer from 'react-player';
import { BaseReactPlayerProps } from 'react-player/base';
import usePlayerStatus from 'hooks/usePlayerStatus';
import { Link } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import {
	RiPlayCircleLine,
	RiPauseCircleLine,
	RiVolumeUpLine,
	RiVolumeMuteLine,
	RiMusic2Line,
	RiInformationLine,
} from 'react-icons/ri';
import PlayerProgressContext from 'contexts/PlayerProgressContext';
import PlayerStateContext from 'contexts/PlayerStateContext';
import TrackContext from 'contexts/TrackContext';

type CoverImageProps = {
	trackImage: IGatsbyImageData | null;
	trackTitle: string;
	handlePlay: () => void;
	isPlayerPlaying: boolean;
};

const CoverImage: React.FC<CoverImageProps> = ({
	trackImage,
	trackTitle,
	handlePlay,
	isPlayerPlaying,
}) => {
	if (trackImage) {
		return (
			<div
				className={
					'relative w-64 h-64 mt-12 mb-12 ml-8 mr-8 bottom-64 border-black border-8 grid grid-rows-none grid-columns-none justify-items-center items-center'
				}
			>
				<GatsbyImage
					className="col-start-1 col-end-1 row-start-1 row-end-1 z-20"
					image={trackImage}
					alt={trackTitle}
				/>
				<button
					className="col-start-1 col-end-1 row-start-1 row-end-1 z-30 w-full opacity-20 hover:opacity-80 cursor-pointer"
					onClick={handlePlay}
					aria-label="Start playback"
				>
					{!isPlayerPlaying && <RiPlayCircleLine size="100%" />}
				</button>
			</div>
		);
	}
	return null;
};

const MemoizedCoverImage = memo(
	CoverImage,
	(prevProps, nextProps) =>
		prevProps.trackImage === nextProps.trackImage &&
		prevProps.trackTitle === nextProps.trackTitle &&
		prevProps.handlePlay === nextProps.handlePlay &&
		prevProps.isPlayerPlaying === nextProps.isPlayerPlaying
);

const Player: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({
	children,
}) => {
	const { setPlayedSeconds } = useContext(PlayerProgressContext);
	const {
		isPlayerPlaying,
		setIsPlayerPlaying,
		playerVolume,
		setPlayerVolume,
		isPlayerMuted,
		setIsPlayerMuted,
		playerPlaybackRate,
		setPlayerPlaybackRate,
	} = useContext(PlayerStateContext);
	const {
		trackAudioURL,
		trackImage,
		trackSlug,
		trackTitle,
		trackEpisodeNum,
	} = useContext(TrackContext);

	const {
		player,
		playedPercentage,
		setPlayedPercentage,
		seeking,
		setSeeking,
		setMediaLoadedAndReady,
	} = usePlayerStatus();

	const handlePlayPause = () => {
		setIsPlayerPlaying(!isPlayerPlaying);
	};

	const handlePlay = () => {
		setIsPlayerPlaying(true);
	};

	const handlePause = () => {
		setIsPlayerPlaying(false);
	};

	const handleVolumeChange: React.ChangeEventHandler<HTMLInputElement> = (
		e
	) => {
		setPlayerVolume(parseFloat(e.target.value));
	};

	const handleToggleMuted = () => {
		setIsPlayerMuted(!isPlayerMuted);
	};

	const handleSetPlaybackRate: React.PointerEventHandler<HTMLButtonElement> =
		(e) => {
			setPlayerPlaybackRate(
				parseFloat((e.target as HTMLButtonElement).value)
			);
		};

	const handleSeekMouseDown = () => {
		setSeeking(true);
	};

	const handleSeekChange: React.ChangeEventHandler<HTMLInputElement> = (
		e
	) => {
		setPlayedPercentage(parseFloat(e.target.value));
	};

	const handleSeekMouseUp: React.PointerEventHandler<HTMLInputElement> = (
		e
	) => {
		const playedFraction = parseFloat((e.target as HTMLInputElement).value);
		setSeeking(false);
		if (player.current) {
			player.current.seekTo(playedFraction, 'fraction');
		}
	};

	const handlePlayerProgress: BaseReactPlayerProps['onProgress'] = (
		progressData
	) => {
		// only if not currently seeking and is playing
		if (!seeking && isPlayerPlaying) {
			setPlayedPercentage(progressData.played);
			setPlayedSeconds(progressData.playedSeconds);
		}
	};

	const handleMediaLoadedAndReady = () => {
		setMediaLoadedAndReady(true);
	};

	const handleTrackEnded = () => {
		setIsPlayerPlaying(false);
		setPlayedPercentage(0);
		setPlayedSeconds(0);
	};

	return (
		<React.Fragment>
			<nav
				className="flex flex-row fixed bottom-0 z-50 text-white bg-player w-full h-player justify-center"
				role="navigation"
				aria-label="Podcast player controls"
			>
				<ReactPlayer
					className="hidden"
					ref={player}
					url={trackAudioURL}
					playing={isPlayerPlaying}
					controls={false}
					loop={false}
					playbackRate={playerPlaybackRate}
					volume={playerVolume}
					muted={isPlayerMuted}
					onReady={handleMediaLoadedAndReady}
					onPlay={handlePlay}
					onPause={handlePause}
					onEnded={handleTrackEnded}
					onError={(e) => console.warn('Player error: ', e)}
					onProgress={handlePlayerProgress}
					config={{
						file: {
							forceAudio: true,
						},
					}}
				/>
				<div>
					<MemoizedCoverImage
						trackImage={trackImage}
						trackTitle={trackTitle}
						handlePlay={handlePlay}
						isPlayerPlaying={isPlayerPlaying}
					/>
				</div>
				<span className="kern-episode-num text-6xl flex justify-center items-center mr-4 font-display tracking-display">
					{trackEpisodeNum}
				</span>
				<Link
					to={trackSlug}
					className="no-underline hover:underline hover:font-bold flex justify-center items-center mr-8"
				>
					<h3 className="flex justify-center items-center pb-1 pt-1 font-body text-lg leading-5">
						{trackTitle}
					</h3>
				</Link>
				<button
					className="text-6xl mr-2"
					onClick={handlePlayPause}
					role="switch"
					aria-label="Play/Pause Button"
					aria-checked={isPlayerPlaying}
				>
					{isPlayerPlaying ? (
						<RiPauseCircleLine />
					) : (
						<RiPlayCircleLine />
					)}
				</button>
				<input
					type="range"
					min={0}
					max={0.999999}
					step="any"
					value={playedPercentage}
					onMouseDown={handleSeekMouseDown}
					onChange={handleSeekChange}
					onMouseUp={handleSeekMouseUp}
					className={'w-full m-4 cursor-pointer'}
					aria-label="Seek and progress slider"
				/>
				<div className="flex justify-center items-center group relative">
					<button
						onClick={handleToggleMuted}
						className={'tooltip p-4 text-4xl cursor-pointer'}
						data-text={'Volume'}
						title="Volume Button"
						aria-pressed={isPlayerMuted}
					>
						{isPlayerMuted ? (
							<RiVolumeMuteLine />
						) : (
							<RiVolumeUpLine />
						)}
					</button>
					<span
						className={
							'absolute bottom-full hidden hover:flex group-hover:flex bg-player pb-4 w-16 justify-center pt-4'
						}
					>
						<input
							type="range"
							min={0}
							max={1}
							step="any"
							value={playerVolume}
							onInput={handleVolumeChange}
							className={'cursor-pointer volume-vertical'}
							title="Volume Slider"
						/>
					</span>
				</div>
				<div className="tooltip flex justify-center items-center group relative">
					<span
						className={'tooltip text-4xl p-4'}
						data-text={'Speed'}
						title="Playback Speed Button"
					>
						<RiMusic2Line />
					</span>
					<div
						className={
							'absolute bottom-full hidden hover:flex group-hover:flex bg-player w-16 justify-center flex-col-reverse'
						}
					>
						{[0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => {
							const selected = playerPlaybackRate === speed;
							return (
								<button
									key={speed}
									className={`p-2 hover:font-bold ${
										selected ? 'font-bold' : ''
									}`}
									aria-pressed={selected}
									onClick={handleSetPlaybackRate}
									value={speed}
									title={`Playback Speed ${speed}`}
								>
									{`${speed}x`}
								</button>
							);
						})}
					</div>
				</div>
				<Link
					to={trackSlug}
					className="text-4xl mr-2 flex justify-center items-center"
					title="Episode Info and Subtitles"
				>
					<span className="tooltip p-4" data-text={'Info/Subs'}>
						<RiInformationLine />
					</span>
				</Link>
			</nav>
			{children}
		</React.Fragment>
	);
};

// TODO style both of the range's

export default Player;
