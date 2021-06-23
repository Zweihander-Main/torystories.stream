import React from 'react';
import ReactPlayer from 'react-player';
import { BaseReactPlayerProps } from 'react-player/base';
import usePlayerState from 'hooks/usePlayerState';
import { Link, graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from 'gatsby-plugin-image';
import {
	RiPlayCircleLine,
	RiPauseCircleLine,
	RiVolumeUpLine,
	RiVolumeMuteLine,
	RiMusic2Line,
	RiInformationLine,
} from 'react-icons/ri';

const Player: React.FC = () => {
	const defaultID =
		useStaticQuery<GatsbyTypes.DefaultEpisodeIDQueryQuery>(graphql`
			query DefaultEpisodeIDQuery {
				allMarkdownRemark(
					limit: 1
					sort: { fields: frontmatter___date, order: DESC }
					filter: {
						fields: { sourceInstanceName: { eq: "episodes" } }
					}
				) {
					edges {
						node {
							id
						}
					}
				}
			}
		`);

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
		setPlayerReady,
	} = usePlayerState({
		defaultID: defaultID.allMarkdownRemark.edges[0].node.id,
	});

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
		<div className="flex flex-row fixed bottom-0 z-50 text-white bg-black w-full h-player justify-center">
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
							'relative w-64 h-64 mt-12 mb-12 ml-8 mr-8 bottom-64 border-black border-8 box-content grid grid-rows-none grid-columns-none justify-items-center items-center'
						}
					>
						<GatsbyImage
							className="col-start-1 col-end-1 row-start-1 row-end-1 z-20"
							image={image}
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
				1
			</span>
			<Link
				to={slug}
				className="hover:underline hover:font-bold flex justify-center items-center mr-8"
			>
				<h3 className="flex justify-center items-center pb-1 pt-1 font-body text-lg leading-5">
					Why Lord Liverpool Should Be Considered Britain's Greatest
					Prime Minister
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
				className={'w-full m-4'}
			/>
			<div className="flex justify-center items-center m-4">
				<span onClick={handleToggleMuted} className={'text-4xl'}>
					{muted ? <RiVolumeMuteLine /> : <RiVolumeUpLine />}
				</span>
				<input
					type="range"
					min={0}
					max={1}
					step="any"
					value={volume}
					onChange={handleVolumeChange}
					orient="vertical"
					className={'absolute bottom-0'}
					style={{
						'writing-mode': 'bt-lr',
						appearance: 'slider-vertical',
					}}
				/>
			</div>
			<div className="flex justify-center items-center m-4">
				<span className={'text-4xl'}>
					<RiMusic2Line />
				</span>
				<div className="absolute bottom-0">
					<button onClick={handleSetPlaybackRate} value={0.75}>
						0.75x
					</button>
					<button onClick={handleSetPlaybackRate} value={1}>
						1x
					</button>
					<button onClick={handleSetPlaybackRate} value={1.25}>
						1.25x
					</button>
					<button onClick={handleSetPlaybackRate} value={1.5}>
						1.5x
					</button>
					<button onClick={handleSetPlaybackRate} value={1.75}>
						1.75x
					</button>
					<button onClick={handleSetPlaybackRate} value={2}>
						2x
					</button>
				</div>
			</div>
			<Link
				to={slug}
				className="text-4xl m-4 flex justify-center items-center"
			>
				<RiInformationLine />
			</Link>
		</div>
	);
};

// TODO title on hover
// TODO style

export default Player;
