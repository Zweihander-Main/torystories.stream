import * as React from 'react';
import { memo, useCallback, useContext } from 'react';
import { BaseReactPlayerProps } from 'react-player/base';
import ReactPlayer from 'react-player';
import TrackContext from '../contexts/TrackContext';
import PlayerProgressContext from '../contexts/PlayerProgressContext';
import PlayerStateContext from '../contexts/PlayerStateContext';

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
		setIsPlayerBuffering,
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

	const handleBufferStart = useCallback(() => {
		setIsPlayerBuffering(true);
	}, [setIsPlayerBuffering]);

	const handleBufferEnd = useCallback(() => {
		setIsPlayerBuffering(false);
	}, [setIsPlayerBuffering]);

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
			onBuffer={handleBufferStart}
			onBufferEnd={handleBufferEnd}
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

export default MemoizedReactPlayerComp;
