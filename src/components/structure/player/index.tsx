import React, { useRef, useState } from 'react';
import ReactPlayer from 'react-player';

type PlayerProps = {
	url: string;
};

const Player: React.FC<PlayerProps> = ({ url }) => {
	const player = useRef<null | ReactPlayer>(null);
	const [played, setPlayed] = useState(0);
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

	const handleVolumeChange = (e) => {
		setVolume(parseFloat(e.target.value));
	};

	const handleToggleMuted = () => {
		setMuted(!muted);
	};

	const handleSetPlaybackRate = (e) => {
		setPlaybackRate(parseFloat(e.target.value));
	};

	const handleSeekMouseDown = () => {
		setSeeking(true);
	};

	const handleSeekChange: React.ChangeEventHandler<HTMLInputElement> = (
		e
	) => {
		setPlayed(parseFloat(e.target.value));
	};

	const handleSeekMouseUp: React.MouseEventHandler<HTMLInputElement> = (
		e
	) => {
		const percentDone = parseFloat(e.target.value);
		setSeeking(false);
		if (player.current) {
			player.current.seekTo(percentDone);
		}
	};

	const handleProgress = (state) => {
		// only if not currently seeking
		if (!seeking) {
			setPlayed(state.played);
		}
	};

	const handleEnded = () => {
		setPlaying(false);
	};

	const handleDuration = (duration: number) => {
		setDuration(duration);
	};

	return (
		<div className="flex flex-row fixed bottom-0 z-50 bg-black w-screen h-20">
			<ReactPlayer
				ref={player}
				url={url}
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
			/>
			<button onClick={handlePlayPause}>
				{playing ? 'Pause' : 'Play'}
			</button>
			<input
				type="range"
				min={0}
				max={0.999999}
				step="any"
				value={played}
				onMouseDown={handleSeekMouseDown}
				onChange={handleSeekChange}
				onMouseUp={handleSeekMouseUp}
			/>
		</div>
	);
};

export default Player;
