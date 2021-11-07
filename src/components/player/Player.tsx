import React, { memo, useCallback, useContext } from 'react';
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

type ReactPlayerCompProps = {
	player: React.MutableRefObject<ReactPlayer | null>;
	setPlayedPercentage: React.Dispatch<React.SetStateAction<number>>;
	isSeeking: boolean;
	setMediaLoadedAndReady: React.Dispatch<React.SetStateAction<boolean>>;
};

const ReactPlayerComp: React.FC<ReactPlayerCompProps> = ({
	player,
	setPlayedPercentage,
	isSeeking,
	setMediaLoadedAndReady,
}) => {
	const { trackAudioURL } = useContext(TrackContext);
	const { setPlayedSeconds } = useContext(PlayerProgressContext);
	const {
		isPlayerMuted,
		playerVolume,
		playerPlaybackRate,
		isPlayerPlaying,
		setIsPlayerPlaying,
	} = useContext(PlayerStateContext);

	const handleTrackEnded = useCallback(() => {
		setIsPlayerPlaying(false);
		setPlayedPercentage(0);
		setPlayedSeconds(0);
	}, [setIsPlayerPlaying, setPlayedPercentage, setPlayedSeconds]);

	const handleMediaLoadedAndReady = useCallback(() => {
		setMediaLoadedAndReady(true);
	}, [setMediaLoadedAndReady]);

	type onProgressParam = Parameters<
		Exclude<BaseReactPlayerProps['onProgress'], undefined>
	>[0];

	const handlePlayerProgress: BaseReactPlayerProps['onProgress'] =
		useCallback(
			(progressData: onProgressParam) => {
				// only if not currently seeking and is playing
				if (!isSeeking && isPlayerPlaying) {
					setPlayedPercentage(progressData.played);
					setPlayedSeconds(progressData.playedSeconds);
				}
			},
			[isPlayerPlaying, isSeeking, setPlayedPercentage, setPlayedSeconds]
		);

	const handlePlay = useCallback(() => {
		setIsPlayerPlaying(true);
	}, [setIsPlayerPlaying]);

	const handlePause = useCallback(() => {
		setIsPlayerPlaying(false);
	}, [setIsPlayerPlaying]);

	type onErrorParam = Parameters<
		Exclude<BaseReactPlayerProps['onError'], undefined>
	>[0];

	const handleError: BaseReactPlayerProps['onError'] = useCallback(
		(e: onErrorParam) => {
			console.warn('Player error: ', e);
		},
		[]
	);

	return (
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
			onError={handleError}
			onProgress={handlePlayerProgress}
			config={{
				file: {
					forceAudio: true,
				},
			}}
		/>
	);
};

const MemoizedReactPlayerComp = memo(
	ReactPlayerComp,
	(prevProps, nextProps) => prevProps.isSeeking === nextProps.isSeeking
);

type GatsbyCoverImageProps = {
	trackImage: IGatsbyImageData;
	trackTitle: string;
};

const GatsbyCoverImage: React.FC<GatsbyCoverImageProps> = ({
	trackImage,
	trackTitle,
}) => (
	<GatsbyImage
		className="bg-black col-start-1 col-end-1 row-start-1 row-end-1 z-20"
		image={trackImage}
		alt={trackTitle}
	/>
);

const MemoizedGatsbyCoverImage = memo(GatsbyCoverImage);

const CoverImage: React.FC = () => {
	const { trackImage, trackTitle } = useContext(TrackContext);
	const { isPlayerPlaying, setIsPlayerPlaying } =
		useContext(PlayerStateContext);

	const handlePlay = useCallback(() => {
		setIsPlayerPlaying(true);
	}, [setIsPlayerPlaying]);

	if (trackImage) {
		return (
			<div>
				<div
					className={
						'relative w-32 h-32 2xl:w-64 2xl:h-64 mt-12 mb-12 ml-4 2xl:ml-8 mr-4 2xl:mr-8 bottom-32 2xl:bottom-64 border-black border-8 grid grid-rows-none grid-columns-none justify-items-center items-center'
					}
				>
					<MemoizedGatsbyCoverImage {...{ trackImage, trackTitle }} />
					<button
						className="col-start-1 col-end-1 row-start-1 row-end-1 z-30 w-full opacity-20 hover:opacity-80 cursor-pointer"
						onClick={handlePlay}
						aria-label="Start playback"
					>
						{!isPlayerPlaying && <RiPlayCircleLine size="100%" />}
					</button>
				</div>
			</div>
		);
	}
	return null;
};

const MemoizedCoverImage = memo(CoverImage);

const TrackInfo: React.FC = () => {
	const { trackEpisodeNum, trackSlug, trackTitle } = useContext(TrackContext);

	return (
		<React.Fragment>
			<span className="kern-episode-num text-6xl flex justify-center items-center mr-4 font-display tracking-display text-shadow">
				{trackEpisodeNum}
			</span>
			<Link
				to={trackSlug}
				className="no-underline hover:underline hover:font-bold flex justify-center flex-playerTrack items-center mr-2 xl:mr-4 2xl:mr-8"
			>
				<h3 className="flex justify-center items-center pb-1 pt-1 font-body text-lg leading-5 text-shadow">
					{trackTitle}
				</h3>
			</Link>
		</React.Fragment>
	);
};

const MemoizedTrackInfo = memo(TrackInfo);

const PlayerStateControls: React.FC = () => {
	const {
		playerVolume,
		setPlayerVolume,
		isPlayerMuted,
		setIsPlayerMuted,
		playerPlaybackRate,
		setPlayerPlaybackRate,
	} = useContext(PlayerStateContext);

	const { trackSlug } = useContext(TrackContext);

	const handleVolumeChange: React.ChangeEventHandler<HTMLInputElement> =
		useCallback(
			(e) => {
				setPlayerVolume(parseFloat(e.target.value));
			},
			[setPlayerVolume]
		);

	const handleToggleMuted = useCallback(() => {
		setIsPlayerMuted(!isPlayerMuted);
	}, [setIsPlayerMuted, isPlayerMuted]);

	const handleSetPlaybackRate: React.PointerEventHandler<HTMLButtonElement> =
		useCallback(
			(e) => {
				setPlayerPlaybackRate(
					parseFloat((e.target as HTMLButtonElement).value)
				);
			},
			[setPlayerPlaybackRate]
		);

	return (
		<React.Fragment>
			<div className="flex justify-center items-center group relative">
				<button
					onClick={handleToggleMuted}
					className={'tooltip p-4 text-4xl cursor-pointer'}
					data-text={'Volume'}
					title="Volume Button"
					aria-pressed={isPlayerMuted}
				>
					{isPlayerMuted ? <RiVolumeMuteLine /> : <RiVolumeUpLine />}
				</button>
				<span
					className={
						'absolute bottom-full hidden hover:flex group-hover:flex bg-player w-16 justify-center pb-4 pt-4'
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
		</React.Fragment>
	);
};

const MemoizedPlayerStateControls = memo(PlayerStateControls);

const PlayPauseButton: React.FC = () => {
	const { isPlayerPlaying, setIsPlayerPlaying } =
		useContext(PlayerStateContext);

	const handlePlayPause = useCallback(() => {
		setIsPlayerPlaying(!isPlayerPlaying);
	}, [setIsPlayerPlaying, isPlayerPlaying]);

	return (
		<React.Fragment>
			<button
				className="text-6xl mr-0 2xl:mr-2"
				onClick={handlePlayPause}
				role="switch"
				aria-label="Play/Pause Button"
				aria-checked={isPlayerPlaying}
			>
				{isPlayerPlaying ? <RiPauseCircleLine /> : <RiPlayCircleLine />}
			</button>
		</React.Fragment>
	);
};

const MemoizedPlayPauseButton = memo(PlayPauseButton);

type SeekBarProps = {
	player: React.MutableRefObject<ReactPlayer | null>;
	playedPercentage: number;
	setPlayedPercentage: React.Dispatch<React.SetStateAction<number>>;
	setIsSeeking: React.Dispatch<React.SetStateAction<boolean>>;
};

const SeekBar: React.FC<SeekBarProps> = ({
	player,
	playedPercentage,
	setPlayedPercentage,
	setIsSeeking,
}) => {
	const handleSeekMouseDown = () => {
		setIsSeeking(true);
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
		setIsSeeking(false);
		if (player.current) {
			player.current.seekTo(playedFraction, 'fraction');
		}
	};

	return (
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
	);
};

const MemoizedSeekBar = memo(
	SeekBar,
	(prevProps, nextProps) =>
		prevProps.playedPercentage === nextProps.playedPercentage
);

const Player: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({
	children,
}) => {
	const {
		player,
		playedPercentage,
		setPlayedPercentage,
		isSeeking,
		setIsSeeking,
		setMediaLoadedAndReady,
	} = usePlayerStatus();

	return (
		<React.Fragment>
			<nav
				className="flex flex-row fixed bottom-0 z-50 text-white bg-player w-full h-player justify-center"
				role="navigation"
				aria-label="Podcast player controls"
			>
				<MemoizedReactPlayerComp
					{...{
						player,
						setPlayedPercentage,
						setMediaLoadedAndReady,
						isSeeking,
					}}
				/>
				<MemoizedCoverImage />
				<MemoizedTrackInfo />
				<MemoizedPlayPauseButton />
				<MemoizedSeekBar
					{...{
						player,
						playedPercentage,
						setPlayedPercentage,
						setIsSeeking,
					}}
				/>
				<MemoizedPlayerStateControls />
			</nav>
			{children}
		</React.Fragment>
	);
};

export default Player;
