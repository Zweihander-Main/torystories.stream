import React from 'react';
import ReactPlayer from 'react-player';
import { BaseReactPlayerProps } from 'react-player/base';
import usePlayerState from 'hooks/usePlayerState';
import useEpisodeList from 'hooks/useEpisodeList';
import { graphql, useStaticQuery } from 'gatsby';
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
		<div className="flex flex-row fixed bottom-0 z-50 text-white bg-black w-screen h-player">
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
					<GatsbyImage
						className={
							'relative w-64 h-64 m-12 bottom-64 border-black border-8 box-content'
						}
						image={image}
					/>
				)}
			</div>
			<button onClick={handlePlayPause}>
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
				className={'w-full'}
			/>
			<div>
				<span onClick={handleToggleMuted}>
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
					style={{
						'writing-mode': 'bt-lr',
						appearance: 'slider-vertical',
					}}
				/>
			</div>
			<div>
				<span>
					<RiMusic2Line />
				</span>
				<span>
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
				</span>
			</div>
			<button>
				<RiInformationLine />
			</button>
		</div>
	);
};

// TODO title on hover
// TODO style

export default Player;
