import React, { memo, useCallback, useContext, useRef, useState } from 'react';
import { SubtitlesArray } from 'types';
import useCurrentSub from 'hooks/useCurrentSub';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { useEffect } from 'react';
import PlayerStateContext from 'contexts/PlayerStateContext';
import { SCROLL_TIMEOUT_PERIOD } from 'utils/constants';

type SubtitleTextProps = {
	subtitlesArray: SubtitlesArray;
	currentSubIndex: number;
	shouldScroll: boolean;
	className?: string;
};

const SubtitleText: React.FC<SubtitleTextProps> = ({
	subtitlesArray,
	currentSubIndex,
	shouldScroll,
	className = '',
}) => {
	const currentSubRef = useCallback(
		(node: HTMLSpanElement | null) => {
			if (shouldScroll === true && node !== null) {
				node.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
			}
		},
		[shouldScroll]
	);

	if (currentSubIndex === -1) {
		currentSubRef(null);
	}

	return (
		<p
			className={`text-xl p-20 text-justify pb-64 ${className}`}
			aria-label={'Subtitle Scrolling Text'}
		>
			{subtitlesArray.map((sub, index) => {
				const { text, startTime } = sub;
				const isCurrentSub = currentSubIndex === index;
				const className = isCurrentSub ? 'font-bold' : '';
				return (
					<span
						key={startTime}
						ref={isCurrentSub ? currentSubRef : null}
						className={className}
						aria-selected={isCurrentSub}
					>
						{text}{' '}
					</span>
				);
			})}
		</p>
	);
};

const MemoizedSubtitleText: React.FC<SubtitleTextProps> = memo(
	SubtitleText,
	(prevProps, nextProps) =>
		prevProps.currentSubIndex === nextProps.currentSubIndex &&
		prevProps.subtitlesArray === nextProps.subtitlesArray &&
		prevProps.shouldScroll === nextProps.shouldScroll
);

type BGImageProps = {
	image: IGatsbyImageData | null;
	title: string;
};

const BGImage: React.FC<BGImageProps> = ({ image, title }) => {
	if (image) {
		return (
			<GatsbyImage
				image={image}
				alt={title}
				className="sticky row-start-1 row-end-1 col-start-1 col-end-1 z-10 top-0 h-screenMinusPlayer opacity-40"
				objectPosition={''}
				style={{
					position: 'sticky',
				}}
			/>
		);
	}
	return null;
};

const MemoizedBGImage = memo(
	BGImage,
	(prevProps, nextProps) =>
		prevProps.image === nextProps.image &&
		prevProps.title === nextProps.title
);

type SubtitlesProps = {
	subtitlesArray: SubtitlesArray;
	image: IGatsbyImageData | null;
	title: string;
};

const Subtitles: React.FC<SubtitlesProps> = ({
	subtitlesArray,
	image,
	title,
}) => {
	const [shouldTrackCurSub, setShouldTrackCurSub] = useState(false);
	const [shouldClearTimeout, setShouldClearTimeout] = useState(false);
	const [shouldResetTimeout, setShouldResetTimeout] = useState(false);
	const scrollTimeoutID = useRef<number>();

	const currentSubIndex = useCurrentSub(subtitlesArray);

	const { isPlayerPlaying } = useContext(PlayerStateContext);

	const handleScroll = () => {
		if (shouldTrackCurSub) {
			setShouldTrackCurSub(false);
		}
		if (isPlayerPlaying) {
			setShouldResetTimeout(true);
		}
	};

	useEffect(() => {
		if (isPlayerPlaying) {
			setShouldTrackCurSub(true);
		} else {
			setShouldTrackCurSub(false);
			setShouldClearTimeout(true);
		}
	}, [isPlayerPlaying]);

	useEffect(() => {
		if (shouldResetTimeout) {
			window.clearTimeout(scrollTimeoutID.current);
			scrollTimeoutID.current = window.setTimeout(() => {
				setShouldTrackCurSub(true);
			}, SCROLL_TIMEOUT_PERIOD);
			setShouldResetTimeout(false);
		}
	}, [shouldResetTimeout]);

	useEffect(() => {
		if (shouldClearTimeout) {
			window.clearTimeout(scrollTimeoutID.current);
			setShouldClearTimeout(false);
		}
	}, [shouldClearTimeout]);

	useEffect(() => {
		return () => window.clearTimeout(scrollTimeoutID.current);
	}, []);

	// if reset is true,
	//     set reset to false, clear timeout, call again (due to dep on reset)
	// else
	//     set a timeout assuming handleScroll was called
	// useEffect(() => {
	// 	if (shouldClearTimeout === true) {
	// 		setShouldClearTimeout(false);
	// 		window.clearTimeout(scrollTimeoutID.current);
	// 	} else if (shouldTrackCurSub === false) {
	// 		scrollTimeoutID.current = window.setTimeout(() => {
	// 			setShouldTrackCurSub(true);
	// 		}, SCROLL_TIMEOUT_PERIOD);
	// 	}
	// 	return () => window.clearTimeout(scrollTimeoutID.current);
	// }, [shouldTrackCurSub, shouldClearTimeout]);

	return (
		<section
			className="grid grid-rows-0 grid-cols-0 bg-black h-screenMinusPlayer overflow-y-scroll z-10 scrollbar scrollbar-track-dullBlue scrollbar-thumb-brightBlue"
			onWheel={handleScroll}
			onTouchMove={handleScroll}
			onMouseDown={handleScroll}
			aria-label={'Subtitles'}
		>
			<MemoizedBGImage {...{ image, title }} />
			<MemoizedSubtitleText
				{...{
					subtitlesArray,
					currentSubIndex,
					shouldScroll: shouldTrackCurSub,
				}}
				className="row-start-1 row-end-1 col-start-1 col-end-1 z-50 "
			/>
		</section>
	);
};

export default memo(Subtitles);
