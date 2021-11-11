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
	RiSoundModuleLine,
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
		className="z-20 col-start-1 col-end-1 row-start-1 row-end-1 bg-black"
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
						'z-10 absolute h-16 w-16 md:h-24 md:w-24 lg:relative lg:w-32 lg:h-32 2xl:w-64 2xl:h-64 lg:mt-12 lg:mb-12 lg:ml-4 2xl:ml-8 lg:mr-4 2xl:mr-8 lg:bottom-32 2xl:bottom-64 lg:border-black lg:border-8 lg:grid grid-rows-none grid-columns-none justify-items-center items-center'
					}
				>
					<MemoizedGatsbyCoverImage {...{ trackImage, trackTitle }} />
					<button
						className="z-30 hidden w-full col-start-1 col-end-1 row-start-1 row-end-1 cursor-pointer lg:inline opacity-20 hover:opacity-80"
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
		<div className="absolute top-0 z-20 w-playerTextMobileSmall md:-ml-28 md:w-playerTextMobile lg:ml-0 lg:top-auto lg:w-auto lg:whitespace-normal lg:static lg:contents">
			<span className="items-center justify-center hidden mr-4 text-6xl font-normal text-shadow font-display tracking-display kern-episode-num lg:flex">
				{trackEpisodeNum}
			</span>
			<Link
				to={trackSlug}
				className="items-center justify-center inline-block mr-2 no-underline hover:underline hover:font-bold md:mt-1.5 lg:mt-0 lg:flex lg:flex-playerTrack xl:mr-4 2xl:mr-6"
			>
				<h3 className="pl-1 overflow-hidden text-sm leading-5 text-center whitespace-nowrap overflow-ellipsis w-playerTextMobileSmall md:w-playerTextMobile lg:whitespace-normal lg:w-auto lg:text-left lg:flex lg:items-center lg:justify-center lg:pl-0 lg:pt-1 lg:pb-1 font-body md:text-lg text-shadow">
					{trackTitle}
				</h3>
			</Link>
		</div>
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
		<div className="contents mobile-group">
			<button
				className="block p-4 text-3xl cursor-pointer md:text-4xl md:hidden tooltip"
				title="Player Controls"
			>
				<RiSoundModuleLine />
			</button>
			<div className="absolute right-0 hidden w-auto mobile-group-hover:flex bottom-playerMobileMenu bg-player md:bottom-auto md:right-auto md:bg-none md:static md:group-hover:contents md:contents">
				<div className="relative flex items-center justify-center order-2 md:order-none group">
					<span
						className={'tooltip p-4 text-3xl md:text-4xl'}
						data-text={'Volume'}
						title="Volume Button"
						aria-checked={!isPlayerMuted}
					>
						{isPlayerMuted ? (
							<RiVolumeMuteLine />
						) : (
							<RiVolumeUpLine />
						)}
					</span>
					<span
						className={
							'absolute bottom-full hidden hover:flex group-hover:flex flex-col bg-player w-16 justify-center pb-4 pt-4'
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
						<button
							className="relative px-1.5 py-1 mx-auto text-sm border-2 border-brightBlue rounded cursor-pointer w-min top-1 hover:border-transparent hover:bg-brightBlue text-brightBlue hover:text-black"
							onClick={handleToggleMuted}
						>
							{!isPlayerMuted ? 'Mute' : 'Unmute'}
						</button>
					</span>
				</div>
				<div className="relative flex items-center justify-center order-3 md:order-none tooltip group">
					<span
						className={'tooltip text-3xl md:text-4xl p-4'}
						data-text={'Speed'}
						title="Playback Speed Menu"
					>
						<RiMusic2Line />
					</span>
					<div
						className={
							'absolute bottom-full hidden hover:flex group-hover:flex bg-player w-auto justify-center flex-col-reverse'
						}
					>
						{[0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => {
							const selected = playerPlaybackRate === speed;
							return (
								<button
									key={speed}
									className={`pt-2 pb-2 pl-5 pr-5 hover:font-bold ${
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
					className="flex items-center justify-center order-1 text-3xl md:text-4xl md:order-none md:mr-2"
					title="Episode Info and Subtitles"
				>
					<span className="p-4 tooltip" data-text={'Info/Subs'}>
						<RiInformationLine />
					</span>
				</Link>
			</div>
		</div>
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
				className="z-20 ml-2 mr-3 text-5xl md:ml-5 md:mr-4 md:text-6xl lg:mr-0 2xl:mr-2 lg:ml-0"
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
			className={'z-20 w-full md:m-4 cursor-pointer'}
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
				className="fixed bottom-0 z-50 flex flex-row justify-center w-full text-white bg-player h-playerSmall md:h-player"
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
