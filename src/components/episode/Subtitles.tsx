import React, { memo, useCallback, useRef, useState } from 'react';
import { SubtitlesArray } from 'types';
import useCurrentSub from 'hooks/useCurrentSub';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import { useEffect } from 'react';

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
		<p className={`text-xl p-20 text-justify ${className}`}>
			{subtitlesArray.map((sub, index) => {
				const { text, startTime } = sub;
				const isCurrentSub = currentSubIndex === index;
				const className = isCurrentSub ? 'font-bold' : '';
				return (
					<span
						key={startTime}
						ref={isCurrentSub ? currentSubRef : null}
						className={className}
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
	const [shouldScroll, setShouldScroll] = useState(true);
	const [resetTimeout, setResetTimeout] = useState(false);
	const scrollTimeoutID = useRef<number>();

	const handleScroll = () => {
		if (shouldScroll === true) {
			setShouldScroll(false);
		} else {
			setResetTimeout(true);
		}
	};

	// if reset is true,
	//     set reset to false, clear timeout, call again (due to dep on reset)
	// else
	//     set a timeout assuming handleScroll was called
	useEffect(() => {
		if (resetTimeout === true) {
			setResetTimeout(false);
			window.clearTimeout(scrollTimeoutID.current);
		} else if (shouldScroll === false) {
			scrollTimeoutID.current = window.setTimeout(() => {
				setShouldScroll(true);
			}, 10000);
		}
		return () => window.clearTimeout(scrollTimeoutID.current);
	}, [shouldScroll, resetTimeout]);

	const currentSubIndex = useCurrentSub(subtitlesArray);

	return (
		<section
			className="grid grid-rows-0 grid-cols-0 bg-black h-screenMinusPlayer overflow-y-scroll z-10 scrollbar scrollbar-track-dullBlue scrollbar-thumb-brightBlue"
			onWheel={handleScroll}
			onTouchMove={handleScroll}
			onMouseDown={handleScroll}
		>
			<MemoizedBGImage image={image} title={title} />
			<MemoizedSubtitleText
				subtitlesArray={subtitlesArray}
				currentSubIndex={currentSubIndex}
				shouldScroll={shouldScroll}
				className="row-start-1 row-end-1 col-start-1 col-end-1 z-50 "
			/>
		</section>
	);
};

// TODO: subtitles can be obscured by image cover
// TODO: if not playing, shouldn't re-scroll except on initial load

export default memo(Subtitles);
