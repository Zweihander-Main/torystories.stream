import React from 'react';
import ReactPlayer from 'react-player';
import { BaseReactPlayerProps } from 'react-player/base';
import usePlayerState from 'hooks/usePlayerState';
import { Link } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import {
	RiPlayCircleLine,
	RiPauseCircleLine,
	RiVolumeUpLine,
	RiVolumeMuteLine,
	RiMusic2Line,
	RiInformationLine,
} from 'react-icons/ri';

const Player: React.FC<React.PropsWithChildren<Record<string, unknown>>> = ({
	children,
}) => {
	const {
		player,
		setPlayedSeconds,
		playedPercentage,
		setPlayedPercentage,
		playing,
		setPlaying,
		volume,
		setVolume,
		muted,
		setMuted,
		playbackRate,
		setPlaybackRate,
		seeking,
		setSeeking,
		url,
		image,
		slug,
		title,
		episodeNum,
		setPlayerReady,
	} = usePlayerState();

	const handlePlayPause = () => {
		setPlaying(!playing);
	};

	const handlePlay = () => {
		setPlaying(true);
	};

	const handlePause = () => {
		setPlaying(false);
	};

	const handleVolumeChange: React.ChangeEventHandler<HTMLInputElement> = (
		e
	) => {
		setVolume(parseFloat(e.target.value));
	};

	const handleToggleMuted = () => {
		setMuted(!muted);
	};

	const handleSetPlaybackRate: React.PointerEventHandler<HTMLButtonElement> =
		(e) => {
			setPlaybackRate(parseFloat((e.target as HTMLButtonElement).value));
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

	const handleProgress: BaseReactPlayerProps['onProgress'] = (
		progressData
	) => {
		// only if not currently seeking and playing
		if (!seeking && playing) {
			setPlayedPercentage(progressData.played);
			setPlayedSeconds(progressData.playedSeconds);
		}
	};

	const handleReady = () => {
		setPlayerReady(true);
	};

	const handleEnded = () => {
		setPlaying(false);
		setPlayedPercentage(0);
		setPlayedSeconds(0);
	};

	return (
		<div>
			<div className="flex flex-row fixed bottom-0 z-50 text-white bg-player w-full h-player justify-center">
				<ReactPlayer
					className="hidden"
					ref={player}
					url={url}
					playing={playing}
					controls={false}
					loop={false}
					playbackRate={playbackRate}
					volume={volume}
					muted={muted}
					onReady={handleReady}
					onPlay={handlePlay}
					onPause={handlePause}
					onEnded={handleEnded}
					onError={(e) => console.log('Player error: ', e)}
					onProgress={handleProgress}
					config={{
						file: {
							forceAudio: true,
						},
					}}
				/>
				<div>
					{image && (
						<div
							className={
								'relative w-64 h-64 mt-12 mb-12 ml-8 mr-8 bottom-64 border-black border-8 grid grid-rows-none grid-columns-none justify-items-center items-center'
							}
						>
							<GatsbyImage
								className="col-start-1 col-end-1 row-start-1 row-end-1 z-20"
								image={image}
								alt={title}
							/>
							<button
								className="col-start-1 col-end-1 row-start-1 row-end-1 z-30 w-full opacity-20 hover:opacity-80 cursor-pointer"
								onClick={handlePlay}
							>
								{!playing && <RiPlayCircleLine size={'100%'} />}
							</button>
						</div>
					)}
				</div>
				<span className="kern-episode-num text-6xl flex justify-center items-center mr-4 font-display tracking-display">
					{episodeNum}
				</span>
				<Link
					to={slug}
					className="no-underline hover:underline hover:font-bold flex justify-center items-center mr-8"
				>
					<h3 className="flex justify-center items-center pb-1 pt-1 font-body text-lg leading-5">
						{title}
					</h3>
				</Link>
				<button className="text-6xl mr-2" onClick={handlePlayPause}>
					{playing ? <RiPauseCircleLine /> : <RiPlayCircleLine />}
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
				/>
				<div className="flex justify-center items-center group relative">
					<span
						onClick={handleToggleMuted}
						className={'tooltip p-4 text-4xl cursor-pointer'}
						data-text={'Volume'}
					>
						{muted ? <RiVolumeMuteLine /> : <RiVolumeUpLine />}
					</span>
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
							value={volume}
							onChange={handleVolumeChange}
							orient="vertical"
							className={'cursor-pointer volume-vertical'}
						/>
					</span>
				</div>
				<div className="tooltip flex justify-center items-center group relative">
					<span
						className={'tooltip text-4xl p-4'}
						data-text={'Speed'}
					>
						<RiMusic2Line />
					</span>
					<div
						className={
							'absolute bottom-full hidden hover:flex group-hover:flex bg-player w-16 justify-center flex-col-reverse'
						}
					>
						{[0.75, 1, 1.25, 1.5, 1.75, 2].map((speed) => (
							<button
								key={speed}
								className={`p-2 hover:font-bold ${
									playbackRate === speed ? 'font-bold' : ''
								}`}
								onClick={handleSetPlaybackRate}
								value={speed}
							>
								{`${speed}x`}
							</button>
						))}
					</div>
				</div>
				<Link
					to={slug}
					className="text-4xl mr-2 flex justify-center items-center"
				>
					<span className="tooltip p-4" data-text={'Info/Subs'}>
						<RiInformationLine />
					</span>
				</Link>
			</div>
			{children}
		</div>
	);
};

// TODO style both of the range's

export default Player;
