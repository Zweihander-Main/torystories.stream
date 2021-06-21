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
		<p className={`p-20 text-justify ${className}`}>
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
			className="grid grid-rows-0 grid-cols-0 h-screenMinusPlayer overflow-y-scroll"
			onWheel={handleScroll}
			onTouchMove={handleScroll}
			onMouseDown={handleScroll}
		>
			{image && (
				<GatsbyImage
					image={image}
					alt={title}
					className="row-start-1 row-end-2 col-start-1 col-end-2 z-10 sticky top-0 h-screenMinusPlayer"
				/>
			)}

			<MemoizedSubtitleText
				subtitlesArray={subtitlesArray}
				currentSubIndex={currentSubIndex}
				shouldScroll={shouldScroll}
				className="row-start-1 row-end-2 col-start-1 col-end-2 z-50"
			/>
		</section>
	);
};

export default Subtitles;
