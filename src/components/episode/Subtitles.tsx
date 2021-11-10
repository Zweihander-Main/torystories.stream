import React, { memo, useCallback, useContext, useRef, useState } from 'react';
import { SubtitlesArray } from 'types';
import useCurrentSub from 'hooks/useCurrentSub';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { useEffect } from 'react';
import PlayerStateContext from 'contexts/PlayerStateContext';
import { SCROLL_TIMEOUT_PERIOD } from 'utils/constants';

type SubtitleTextProps = {
	subtitlesArray: SubtitlesArray;
	currentSubIndex: number | null;
	shouldTrackCurSub: boolean;
	className?: string;
};

const SubtitleText: React.FC<SubtitleTextProps> = ({
	subtitlesArray,
	currentSubIndex,
	shouldTrackCurSub,
	className = '',
}) => {
	const currentSubRef = useCallback(
		(node: HTMLSpanElement | null) => {
			if (shouldTrackCurSub === true && node !== null) {
				node.scrollIntoView({
					behavior: 'smooth',
					block: 'center',
				});
			}
		},
		[shouldTrackCurSub]
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
		prevProps.shouldTrackCurSub === nextProps.shouldTrackCurSub
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
				className="sticky top-0 z-10 col-start-1 col-end-1 row-start-1 row-end-1 h-screenMinusPlayerSmall md:h-screenMinusPlayer opacity-40"
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
	isCurrentlySelectedInPlayer: boolean;
};

const Subtitles: React.FC<SubtitlesProps> = ({
	subtitlesArray,
	image,
	title,
	isCurrentlySelectedInPlayer,
}) => {
	const [shouldTrackCurSub, setShouldTrackCurSub] = useState(false);
	const [shouldClearTimeout, setShouldClearTimeout] = useState(false);
	const [shouldResetTimeout, setShouldResetTimeout] = useState(false);

	const scrollTimeoutID = useRef<number>();

	let currentSubIndex = useCurrentSub(subtitlesArray);
	if (!isCurrentlySelectedInPlayer) {
		currentSubIndex = -1;
	}

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

	return (
		<section
			className="z-10 grid overflow-y-scroll bg-black grid-cols-0 grid-rows-0 h-ScreenMinusPlayerSmall md:h-screenMinusPlayer scrollbar scrollbar-track-dullBlue scrollbar-thumb-brightBlue"
			onWheel={handleScroll}
			onTouchMove={handleScroll}
			onMouseDown={handleScroll}
			aria-label={'Subtitles'}
			tabIndex={0}
		>
			<MemoizedBGImage {...{ image, title }} />
			<MemoizedSubtitleText
				{...{
					subtitlesArray,
					currentSubIndex,
					shouldTrackCurSub,
				}}
				className="z-50 col-start-1 col-end-1 row-start-1 row-end-1 "
			/>
		</section>
	);
};

export default memo(Subtitles);
