import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { BaseReactPlayerProps } from 'react-player/base';
import usePlayerState from 'hooks/usePlayerState';
import useEpisodeList from 'hooks/useEpisodeList';
import { useEffect } from 'react';
import { graphql, useStaticQuery } from 'gatsby';

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

	const { id, setID, playedSeconds, setPlayedSeconds } = usePlayerState(
		defaultID.allMarkdownRemark.edges[0].node.id
	);

	const { getEpByID } = useEpisodeList();

	const player = useRef<null | ReactPlayer>(null);
	const [urls, setURLs] = React.useState(getEpByID(id).audioURLs);
	const [playedPercentage, setPlayedPercentage] = useState(0);
	const [playing, setPlaying] = useState(false);
	const [volume, setVolume] = useState(1);
	const [muted, setMuted] = useState(false);
	const [playbackRate, setPlaybackRate] = useState(1.0);
	const [duration, setDuration] = useState(0);
	const [seeking, setSeeking] = useState(false);

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
		const percentDone = parseFloat((e.target as HTMLInputElement).value);
		setSeeking(false);
		if (player.current) {
			player.current.seekTo(percentDone);
		}
	};

	const handleProgress: BaseReactPlayerProps['onProgress'] = ({
		played,
		playedSeconds,
	}) => {
		// only if not currently seeking
		if (!seeking) {
			setPlayedPercentage(played);
			setPlayedSeconds(playedSeconds);
		}
	};

	const handleEnded = () => {
		setPlaying(false);
	};

	const handleDuration = (duration: number) => {
		setDuration(duration);
	};

	useEffect(() => {
		if (player.current && player.current.seekTo && playedSeconds) {
			player.current.seekTo(playedSeconds);
		}
	}, [player]);

	useEffect(() => {
		setURLs(getEpByID(id).audioURLs);
	}, [id]);

	return (
		<div className="flex flex-row fixed bottom-0 z-50 bg-black w-screen h-20">
			<ReactPlayer
				className="hidden"
				ref={player}
				url={urls}
				playing={playing}
				controls={false}
				loop={false}
				playbackRate={playbackRate}
				volume={volume}
				muted={muted}
				onPlay={handlePlay}
				onPause={handlePause}
				onEnded={handleEnded}
				onError={(e) => console.log('Player error: ', e)}
				onProgress={handleProgress}
				onDuration={handleDuration}
				config={{
					file: {
						forceAudio: true,
					},
				}}
			/>
			<input
				type="range"
				min={0}
				max={0.999999}
				step="any"
				value={playedPercentage}
				onMouseDown={handleSeekMouseDown}
				onChange={handleSeekChange}
				onMouseUp={handleSeekMouseUp}
			/>
			<button onClick={handlePlayPause}>
				{playing ? 'Pause' : 'Play'}
			</button>
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
			<input
				type="range"
				min={0}
				max={1}
				step="any"
				value={volume}
				onChange={handleVolumeChange}
			/>
			<input
				id="muted"
				type="checkbox"
				checked={muted}
				onChange={handleToggleMuted}
			/>
		</div>
	);
};

export default Player;
