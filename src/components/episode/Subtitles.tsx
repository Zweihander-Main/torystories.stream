import React, { memo, useCallback } from 'react';
import { SubtitlesArray } from 'types';
import useCurrentSub from 'hooks/useCurrentSub';
import { useEffect } from 'react';

interface SubtitlesProps {
	subtitlesArray: SubtitlesArray;
}

interface SubtitleTextProps extends SubtitlesProps {
	currentSubIndex: number;
}

const SubtitleText: React.FC<SubtitleTextProps> = ({
	subtitlesArray,
	currentSubIndex,
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
		<p className="m-20 text-justify">
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

const Subtitles: React.FC<SubtitlesProps> = ({ subtitlesArray }) => {
	const currentSubIndex = useCurrentSub(subtitlesArray);
	return (
		<section className="h-screenMinusPlayer overflow-y-scroll">
			<MemoizedSubtitleText
				subtitlesArray={subtitlesArray}
				currentSubIndex={currentSubIndex}
			/>
		</section>
	);
};

export default Subtitles;
