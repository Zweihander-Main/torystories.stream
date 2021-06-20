import React, { memo, useCallback } from 'react';
import { SubtitlesArray } from 'types';
import useCurrentSub from 'hooks/useCurrentSub';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';

type SubtitleTextProps = {
	subtitlesArray: SubtitlesArray;
	currentSubIndex: number;
	className?: string;
};

const SubtitleText: React.FC<SubtitleTextProps> = ({
	subtitlesArray,
	currentSubIndex,
	className = '',
}) => {
	const currentSubRef = useCallback((node: HTMLSpanElement | null) => {
		if (node !== null) {
			console.log(node.offsetTop);
		}
	}, []);

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
		prevProps.subtitlesArray === nextProps.subtitlesArray
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
	const currentSubIndex = useCurrentSub(subtitlesArray);
	return (
		<section className="grid grid-rows-0 grid-cols-0 h-screenMinusPlayer overflow-y-scroll">
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
				className="row-start-1 row-end-2 col-start-1 col-end-2 z-50"
			/>
		</section>
	);
};

export default Subtitles;
